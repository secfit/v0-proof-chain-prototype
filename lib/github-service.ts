// GitHub repository analysis service

export interface GitHubRepo {
  owner: string
  repo: string
  branch: string
  url: string
}

export interface RepoFile {
  path: string
  content: string
  size: number
  type: string
}

export interface RepoAnalysis {
  totalFiles: number
  solidityFiles: number
  totalLines: number
  complexity: string
  files: RepoFile[]
}

/**
 * Parse GitHub URL to extract owner, repo, and branch
 */
export function parseGitHubUrl(url: string): GitHubRepo | null {
  try {
    // Support formats:
    // https://github.com/owner/repo
    // https://github.com/owner/repo/tree/branch
    // https://github.com/owner/repo/blob/commit-sha/path
    const regex = /github\.com\/([^/]+)\/([^/]+)(?:\/(?:tree|blob)\/([^/]+))?/
    const match = url.match(regex)

    if (!match) return null

    return {
      owner: match[1],
      repo: match[2],
      branch: match[3] || "", // Empty string means we'll fetch default branch
      url: url,
    }
  } catch (error) {
    console.error("[v0] Error parsing GitHub URL:", error)
    return null
  }
}

/**
 * Fetch repository info to get default branch
 */
async function getRepoInfo(owner: string, repo: string): Promise<{ defaultBranch: string }> {
  try {
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`
    const response = await fetch(repoUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch repository info: ${response.statusText}`)
    }

    const data = await response.json()
    return { defaultBranch: data.default_branch }
  } catch (error) {
    console.error("[v0] Error fetching repo info:", error)
    throw error
  }
}

/**
 * Fetch repository contents from GitHub API
 */
export async function fetchRepoContents(repoInfo: GitHubRepo): Promise<RepoAnalysis> {
  try {
    console.log("[v0] Fetching repository contents:", repoInfo)

    let branch = repoInfo.branch
    if (!branch) {
      const info = await getRepoInfo(repoInfo.owner, repoInfo.repo)
      branch = info.defaultBranch
      console.log("[v0] Using default branch:", branch)
    }

    // Get repository tree
    const treeUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/git/trees/${branch}?recursive=1`
    console.log("[v0] Fetching tree from:", treeUrl)

    const treeResponse = await fetch(treeUrl)

    if (!treeResponse.ok) {
      const errorBody = await treeResponse.text()
      console.error("[v0] Tree fetch failed:", errorBody)
      throw new Error(`Failed to fetch repository tree: ${treeResponse.statusText}`)
    }

    const treeData = await treeResponse.json()

    // Filter for Solidity files
    const solidityFiles = treeData.tree.filter((item: any) => item.type === "blob" && item.path.endsWith(".sol"))

    console.log("[v0] Found Solidity files:", solidityFiles.length)

    // Fetch content for each Solidity file
    const files: RepoFile[] = []
    let totalLines = 0

    for (const file of solidityFiles.slice(0, 20)) {
      // Limit to 20 files for performance
      try {
        const contentUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${file.path}?ref=${branch}`
        const contentResponse = await fetch(contentUrl)

        if (contentResponse.ok) {
          const contentData = await contentResponse.json()
          const content = Buffer.from(contentData.content, "base64").toString("utf-8")
          const lines = content.split("\n").length
          totalLines += lines

          files.push({
            path: file.path,
            content: content,
            size: file.size,
            type: "solidity",
          })
        }
      } catch (error) {
        console.error(`[v0] Error fetching file ${file.path}:`, error)
      }
    }

    // Determine complexity based on lines of code
    let complexity = "Simple"
    if (totalLines > 500 && totalLines <= 2000) complexity = "Medium"
    else if (totalLines > 2000) complexity = "Complex"

    return {
      totalFiles: treeData.tree.length,
      solidityFiles: solidityFiles.length,
      totalLines,
      complexity,
      files,
    }
  } catch (error) {
    console.error("[v0] Error fetching repository contents:", error)
    throw error
  }
}

/**
 * Validate GitHub repository URL
 */
export function validateGitHubUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { valid: false, error: "GitHub URL is required" }
  }

  const repoInfo = parseGitHubUrl(url)
  if (!repoInfo) {
    return { valid: false, error: "Invalid GitHub URL format. Please use: https://github.com/owner/repo" }
  }

  return { valid: true }
}
