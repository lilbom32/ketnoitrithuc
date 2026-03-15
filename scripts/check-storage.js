const { createClient } = require('@supabase/supabase-js');

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const supabase = createClient('https://mujswdetpicqfqggiqkl.supabase.co', serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function check() {
  console.log('=== Checking Documents ===\n');
  
  // Check documents
  const { data: docs, error } = await supabase
    .from('documents')
    .select('id, title, file_url, published, slug')
    .eq('published', true)
    .limit(10);
    
  if (error) {
    console.log('Error fetching documents:', error.message);
  } else {
    console.log('Documents in database:');
    docs.forEach(d => {
      console.log(`\nID: ${d.id}`);
      console.log(`Title: ${d.title}`);
      console.log(`Slug: ${d.slug}`);
      console.log(`file_url: ${d.file_url || '(empty)'}`);
      console.log(`Published: ${d.published}`);
    });
  }
  
  console.log('\n\n=== Checking Storage ===\n');
  
  // Check storage files in root
  const { data: rootFiles, error: rootError } = await supabase.storage.from('documents').list();
  if (rootError) {
    console.log('Error listing root files:', rootError.message);
  } else {
    console.log('Storage files (root):');
    if (rootFiles.length === 0) {
      console.log('  (empty)');
    } else {
      rootFiles.forEach(f => {
        if (f.id) {
          console.log(`  - ${f.name} (${f.metadata?.size || '?'} bytes)`);
        } else {
          console.log(`  - [folder] ${f.name}/`);
        }
      });
    }
  }
  
  // Check if there are subfolders
  const folders = rootFiles?.filter(f => !f.id) || [];
  for (const folder of folders) {
    console.log(`\nStorage files in '${folder.name}/':`);
    const { data: subFiles, error: subError } = await supabase.storage.from('documents').list(folder.name);
    if (subError) {
      console.log('  Error:', subError.message);
    } else {
      subFiles.forEach(f => console.log(`  - ${f.name}`));
    }
  }
  
  // Test signed URL generation for first document
  if (docs && docs[0]?.file_url) {
    console.log('\n\n=== Testing Signed URL Generation ===\n');
    const fileUrl = docs[0].file_url;
    console.log('Testing with file_url:', fileUrl);
    
    // Try direct path
    const { data: signedData, error: signError } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileUrl, 3600);
    
    if (signError) {
      console.log('Direct signed URL failed:', signError.message);
    } else {
      console.log('Direct signed URL success:', signedData.signedUrl.substring(0, 100) + '...');
    }
  }
}

check().catch(console.error);
