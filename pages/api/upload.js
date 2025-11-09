// // pages/api/upload.js
// import { create as IPFSHTTPClient } from 'ipfs-http-client';
// import { IncomingForm } from 'formidable';
// import fs from 'fs';
// import path from 'path';

// // Ensure Node 18's undici fetch includes duplex when sending a body
// try {
//   const __originalFetch = globalThis.fetch;
//   if (typeof __originalFetch === 'function') {
//     globalThis.fetch = (url, options = {}) => {
//       const needsDuplex = options && 'body' in options;
//       return __originalFetch(url, needsDuplex ? { ...options, duplex: 'half' } : options);
//     };
//   }
// } catch (e) {
//   console.warn('Failed to wrap global fetch for duplex handling:', e);
// }

// // Ensure a stable upload directory exists (files will be written here by formidable)
// const uploadDir = path.join(process.cwd(), 'uploads_tmp');
// try {
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log('Created upload directory:', uploadDir);
//   }
// } catch (e) {
//   console.error('Failed to ensure upload directory exists:', e);
// }

// // Log environment info
// console.log('Environment:', {
//   NODE_ENV: process.env.NODE_ENV,
//   IPFS_HOST: process.env.NEXT_PUBLIC_IPFS_HOST || 'ipfs.infura.io',
//   IPFS_PORT: process.env.NEXT_PUBLIC_IPFS_PORT || 5001,
//   IPFS_PROTOCOL: process.env.NEXT_PUBLIC_IPFS_PROTOCOL || 'https',
//   IPFS_API_PATH: process.env.NEXT_PUBLIC_IPFS_API_PATH || '/api/v0'
// });

// // IPFS Credentials Check
// console.log('IPFS Credentials Check:');
// console.log('Project ID:', process.env.NEXT_PUBLIC_IPFS_ID ? 'Present' : 'Missing');
// console.log('Project Secret:', process.env.NEXT_PUBLIC_IPFS_KEY ? 'Present' : 'Missing');

// const allowCors = (handler) => async (req, res) => {
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   );

//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   return await handler(req, res);
// };

// export const config = {
//   api: {
//     bodyParser: false, // Disable body parsing, we'll use formidable for that
//     sizeLimit: '10mb' // Set max request size
//   },
// };

// const projectId = process.env.NEXT_PUBLIC_IPFS_ID;
// const projectSecret = process.env.NEXT_PUBLIC_IPFS_KEY;

// if (!projectId || !projectSecret) {
//   console.error('Missing IPFS credentials in environment variables');
// }

// const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

// // IPFS API endpoint pieces (module scope so helpers can use them)
// const host = process.env.NEXT_PUBLIC_IPFS_HOST || 'ipfs.infura.io';
// const port = parseInt(process.env.NEXT_PUBLIC_IPFS_PORT || '5001', 10);
// const protocol = process.env.NEXT_PUBLIC_IPFS_PROTOCOL || 'https';
// const apiPath = process.env.NEXT_PUBLIC_IPFS_API_PATH || '/api/v0';
// const baseApiUrl = `${protocol}://${host}:${port}${apiPath}`;

// console.log('Using IPFS API URL:', baseApiUrl.replace(auth, '***'));

// // Helper: upload bytes to IPFS via Infura HTTP API directly (avoids ipfs-http-client streaming quirks)
// async function addToIPFS(data, filename = 'file') {
//   const form = new FormData();
//   const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/octet-stream' });
//   form.append('file', blob, filename);

//   const addUrl = `${baseApiUrl}/add?pin=true`;
//   const resp = await fetch(addUrl, {
//     method: 'POST',
//     headers: { authorization: auth },
//     body: form,
//   });

//   const text = await resp.text();
//   if (!resp.ok) {
//     console.error('IPFS add failed:', resp.status, text);
//     throw new Error(`IPFS add failed: ${resp.status}`);
//   }

//   // Response can be single JSON or ndjson; take the last non-empty line
//   const lastLine = text.trim().split('\n').filter(Boolean).pop();
//   const obj = JSON.parse(lastLine);
//   return {
//     path: obj.Hash || obj.path || obj.cid,
//     cid: (obj.Hash || obj.cid || '').toString(),
//     size: Number(obj.Size || obj.size || 0),
//   };
// }

// const parseForm = (req) => {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm({
//       keepExtensions: true,
//       maxFileSize: 10 * 1024 * 1024, // 10MB max file size
//       uploadDir, // explicitly write files to disk so filepath is always present
//       filter: ({ mimetype }) => {
//         // Be permissive: allow all fields and files. We'll validate later if needed.
//         return true;
//       }
//     });

//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         console.error('Form parse error:', err);
//         return reject(err);
//       }
      
//       // Log received fields/files for debugging. Do not enforce presence here; handler will decide.
//       console.log('Parsed form data:', { fields, files });
//       resolve({ fields, files });
//     });
//   });
// };

// async function handler(req, res) {
//   // Log request details
//   console.log('Request headers:', req.headers);
//   console.log('Request method:', req.method);
//   console.log('Request URL:', req.url);
  
//   // Only allow POST requests
//   if (req.method !== 'POST') {
//     return res.status(405).json({ 
//       success: false,
//       error: 'Method not allowed',
//       allowedMethods: ['POST']
//     });
//   }

//   try {
//     console.log('Processing upload request...');
//     const { files, fields } = await parseForm(req);
    
//     // If there is no file, but there is text content (e.g., story), upload that instead
//     if (!files || !files.file) {
//       const textContent = (fields && (fields.file || fields.story)) ? (fields.file || fields.story) : null;
//       if (typeof textContent === 'string' && textContent.trim().length > 0) {
//         try {
//           if (!client) throw new Error('IPFS client is not initialized.');
//           const buffer = Buffer.from(textContent, 'utf8');
//           console.log(`Uploading text field content to IPFS (${buffer.length} bytes)`);
//           const added = await client.add(buffer, { pin: true });
//           return res.status(200).json({
//             success: true,
//             path: added.path,
//             cid: added.cid.toString(),
//             size: added.size
//           });
//         } catch (error) {
//           console.error('Upload error (text fallback):', error);
//           return res.status(500).json({ success: false, error: 'Upload failed', details: error.message });
//         }
//       } else {
//         console.error('No file in upload request and no text fallback content');
//         return res.status(400).json({ 
//           success: false,
//           error: 'No file or text content provided' 
//         });
//       }
//     }

//     // Support both single object and array of files from formidable
//     let file = files.file;
//     if (Array.isArray(file)) {
//       file = file[0];
//     }
//     console.log('Processing file:', {
//       originalFilename: file.originalFilename || file.name || 'unnamed',
//       mimetype: file.mimetype,
//       size: file.size,
//       filepath: file.filepath || file.path,
//     });

//     try {
//       let fileContent;
      
//       // Normalise filepath between formidable versions
//       const diskPath = file.filepath || file.path;

//       // Handle both in-memory and disk-based files
//       if (diskPath && fs.existsSync(diskPath)) {
//         // Read file from disk
//         fileContent = await fs.promises.readFile(diskPath);
//         console.log(`Read ${fileContent.length} bytes from disk file`);
//       } else if (file.buffer) {
//         // Use in-memory buffer if available
//         fileContent = file.buffer;
//         console.log(`Using in-memory file (${fileContent.length} bytes)`);
//       } else if (file.data) {
//         // Handle case where file data is in the data property
//         fileContent = file.data;
//         console.log(`Using file data (${fileContent.length} bytes)`);
//       } else {
//         // Fallback: if the client sent text content as a field (e.g., story text)
//         if (fields && typeof fields.file === 'string') {
//           fileContent = Buffer.from(fields.file, 'utf8');
//           console.log(`Using string field 'file' as content (${fileContent.length} bytes)`);
//         } else if (fields && typeof fields.story === 'string') {
//           fileContent = Buffer.from(fields.story, 'utf8');
//           console.log(`Using string field 'story' as content (${fileContent.length} bytes)`);
//         } else {
//           throw new Error('No file content found or unsupported file type');
//         }
//       }

//       // Add to IPFS using direct HTTP helper
//       console.log('Adding file to IPFS...');
//       const filename = file.originalFilename || file.name || 'upload.bin';
//       const added = await addToIPFS(fileContent, filename);

//       console.log('File added to IPFS:', added);

//       // Clean up the temporary file if it exists
//       if (diskPath && fs.existsSync(diskPath)) {
//         await fs.promises.unlink(diskPath).catch(console.error);
//       }

//       return res.status(200).json({
//         success: true,
//         path: added.path,
//         cid: added.cid,
//         size: added.size
//       });
//     } catch (error) {
//       console.error('Upload error:', error);
//       return res.status(500).json({ 
//         success: false,
//         error: 'Upload failed',
//         details: error.message 
//       });
//     }
//   } catch (error) {
//     console.error('Request processing error:', error);
//     return res.status(500).json({ 
//       success: false,
//       error: 'Request processing failed',
//       details: error.message 
//     });
//   }
// }

// // Test IPFS connection function
// const testIPFSConnection = async () => {
//   try {
//     console.log('Testing IPFS connection...');
//     const version = await client.version();
//     console.log('IPFS Version:', version);
//     return true;
//   } catch (error) {
//     console.error('IPFS Connection Test Failed:', error);
//     return false;
//   }
// };

// // Log IPFS connection status on startup
// testIPFSConnection().then(success => {
//   console.log(`IPFS connection test ${success ? 'succeeded' : 'failed'}`);
// });

// // Apply CORS to the handler and export as default
// export default allowCors(handler);



// pages/api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Pinata credentials are available
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      throw new Error('Missing Pinata API credentials');
    }

    // Parse the incoming form data
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });
    
    const [fields, files] = await form.parse(req);
    
    let file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    // Handle case where content is sent as text field instead of file
    if (!file && fields.story) {
      // Create a temporary file for the story content
      const storyContent = Array.isArray(fields.story) ? fields.story[0] : fields.story;
      const tempPath = `/tmp/story-${Date.now()}.txt`;
      await fs.promises.writeFile(tempPath, storyContent);
      file = {
        filepath: tempPath,
        originalFilename: 'story.txt',
        mimetype: 'text/plain'
      };
    }
    
    if (!file) {
      return res.status(400).json({ error: 'No file or story content provided' });
    }

    console.log('Processing file:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      filepath: file.filepath
    });

    // Prepare form data using axios FormData (works better with Pinata)
    const FormData = require('form-data');
    const formData = new FormData();
    
    // Add the file stream
    formData.append('file', fs.createReadStream(file.filepath), {
      filename: file.originalFilename || 'file',
      contentType: file.mimetype || 'application/octet-stream'
    });
    
    // Add metadata
    const metadata = JSON.stringify({
      name: file.originalFilename || 'crowdfunding-file',
    });
    formData.append('pinataMetadata', metadata);

    // Upload to Pinata using axios
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    // Clean up temporary file if we created one
    if (file.filepath.includes('/tmp/story-')) {
      await fs.promises.unlink(file.filepath).catch(console.error);
    }

    // Return success response
    res.status(200).json({
      success: true,
      hash: response.data.IpfsHash,
      path: response.data.IpfsHash,
      cid: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      size: response.data.PinSize,
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    console.error('Full error:', error.response?.data || error);
    
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      details: error.response?.data?.error || error.message,
    });
  }
}