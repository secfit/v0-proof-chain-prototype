import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('[Verify Audit] Environment check:')
    console.log('[Verify Audit] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('[Verify Audit] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')

    const { auditRequestId } = await request.json()

    if (!auditRequestId) {
      return NextResponse.json({ error: 'Audit request ID is required' }, { status: 400 })
    }

    console.log('[Verify Audit] Looking up audit request ID:', auditRequestId)

    // Test basic Supabase connection first
    console.log('[Verify Audit] Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('audit_requests')
      .select('id')
      .limit(1)
    
    console.log('[Verify Audit] Connection test result:', { testData, testError })

    // Fetch audit result from database
    console.log('[Verify Audit] Querying audit_results table for audit_request_id:', auditRequestId)
    
    const { data: auditResults, error: auditError } = await supabase
      .from('audit_results')
      .select(`
        *,
        audit_requests (
          id,
          project_name,
          developer_wallet,
          estimated_completion_date,
          status,
          created_at
        ),
        audit_owners (
          auditor_name,
          auditor_wallet,
          created_at
        )
      `)
      .eq('audit_request_id', auditRequestId)
      .order('created_at', { ascending: false })

    console.log('[Verify Audit] Query result:', { auditResults, auditError })

    if (auditError) {
      console.error('[Verify Audit] Database error:', auditError)
      return NextResponse.json({ error: 'Failed to fetch audit data' }, { status: 500 })
    }

    if (!auditResults || auditResults.length === 0) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    const auditResult = auditResults[0]
    console.log('[Verify Audit] Found audit result:', auditResult.id)

    // Fetch smart contract information
    console.log('[Verify Audit] Querying smart_contracts table for audit_request_id:', auditRequestId)
    
    const { data: smartContracts, error: contractError } = await supabase
      .from('smart_contracts')
      .select('*')
      .eq('audit_request_id', auditRequestId)

    console.log('[Verify Audit] Smart contracts query result:', { smartContracts, contractError })

    if (contractError) {
      console.error('[Verify Audit] Smart contract error:', contractError)
    }

    // Fetch audit findings
    console.log('[Verify Audit] Querying audit_findings table for audit_request_id:', auditRequestId)
    
    const { data: findings, error: findingsError } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('audit_request_id', auditRequestId)

    console.log('[Verify Audit] Findings query result:', { findings, findingsError })

    if (findingsError) {
      console.error('[Verify Audit] Findings error:', findingsError)
    }

    // Fetch IPFS data if available
    let ipfsData = null
    let ipfsError = null
    
    if (auditResult.ipfs_hash) {
      try {
        console.log('[Verify Audit] Original IPFS Hash from audit_results.ipfs_hash:', auditResult.ipfs_hash)
        
        // Convert ipfs:// protocol to https://ipfs.io/ipfs/ format
        let ipfsUrl = auditResult.ipfs_hash
        if (ipfsUrl.startsWith('ipfs://')) {
          // Remove ipfs:// prefix and add https://ipfs.io/ipfs/ prefix
          const ipfsHash = ipfsUrl.replace('ipfs://', '')
          ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        } else if (!ipfsUrl.startsWith('http')) {
          // If it's just a hash without protocol, add the full URL
          ipfsUrl = `https://ipfs.io/ipfs/${ipfsUrl}`
        }
        
        console.log('[Verify Audit] Constructed IPFS URL:', ipfsUrl)
        
        const ipfsResponse = await fetch(ipfsUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })
        
        console.log('[Verify Audit] IPFS Response Status:', ipfsResponse.status)
        console.log('[Verify Audit] IPFS Response Headers:', Object.fromEntries(ipfsResponse.headers.entries()))
        
        if (ipfsResponse.ok) {
          const responseText = await ipfsResponse.text()
          console.log('[Verify Audit] IPFS Response Text (first 500 chars):', responseText.substring(0, 500))
          
          try {
            ipfsData = JSON.parse(responseText)
            console.log('[Verify Audit] IPFS data parsed successfully:', ipfsData)
          } catch (parseError: any) {
            console.error('[Verify Audit] Failed to parse IPFS response as JSON:', parseError)
            ipfsError = `Failed to parse IPFS response: ${parseError.message}`
          }
        } else {
          const errorText = await ipfsResponse.text()
          console.error('[Verify Audit] IPFS fetch failed:', {
            status: ipfsResponse.status,
            statusText: ipfsResponse.statusText,
            errorText: errorText.substring(0, 500)
          })
          ipfsError = `HTTP ${ipfsResponse.status}: ${ipfsResponse.statusText}`
        }
      } catch (error: any) {
        console.error('[Verify Audit] IPFS fetch error:', error)
        ipfsError = error.message
      }
    } else {
      console.log('[Verify Audit] No IPFS hash found in audit_results table')
      ipfsError = 'No IPFS hash available in audit results'
    }

    // Prepare verification response
    const verificationData = {
      auditRequest: {
        id: auditResult.audit_requests.id,
        projectName: auditResult.audit_requests.project_name,
        developerWallet: auditResult.audit_requests.developer_wallet,
        deadline: auditResult.audit_requests.estimated_completion_date,
        status: auditResult.audit_requests.status,
        createdAt: auditResult.audit_requests.created_at,
      },
      smartContracts: smartContracts || [],
      auditor: {
        name: auditResult.audit_owners?.auditor_name,
        wallet: auditResult.audit_owners?.auditor_wallet,
        acceptedAt: auditResult.audit_owners?.created_at,
      },
      auditResult: {
        id: auditResult.id,
        findingsCount: auditResult.findings_count,
        vulnerabilitiesCount: auditResult.vulnerabilities_count,
        severityBreakdown: auditResult.severity_breakdown,
        completionDate: auditResult.completion_date,
        status: auditResult.status,
        evidenceFileHashes: auditResult.evidence_file_hashes,
      },
      nft: {
        id: auditResult.audit_request_id, // Use audit_request_id as Token ID
        address: auditResult.result_nft_address,
        transactionHash: auditResult.result_nft_transaction_hash,
        explorerUrl: auditResult.result_nft_explorer_url,
        metadataUri: auditResult.result_nft_metadata_uri,
        ipfsHash: auditResult.ipfs_hash,
        ipfsUrl: auditResult.ipfs_hash ? (() => {
          let url = auditResult.ipfs_hash
          if (url.startsWith('ipfs://')) {
            const ipfsHash = url.replace('ipfs://', '')
            url = `https://ipfs.io/ipfs/${ipfsHash}`
          } else if (!url.startsWith('http')) {
            url = `https://ipfs.io/ipfs/${url}`
          }
          return url
        })() : null,
      },
      findings: findings || [],
      ipfsData: ipfsData,
      ipfsError: ipfsError,
      verification: {
        verified: true,
        verifiedAt: new Date().toISOString(),
        blockchainVerified: !!auditResult.result_nft_transaction_hash,
        ipfsVerified: !!ipfsData,
        ipfsError: ipfsError,
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: verificationData 
    })

  } catch (error: any) {
    console.error('[Verify Audit] Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 })
  }
}
