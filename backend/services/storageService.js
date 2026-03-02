const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Valid providers: 'cloudflare', 'backblaze'
 */
const getProviderConfig = () => {
    const provider = process.env.STORAGE_PROVIDER || 'cloudflare';

    if (provider === 'cloudflare') {
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID is missing');
        return {
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            region: 'auto',
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
                secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
            },
            bucket: process.env.CLOUDFLARE_R2_BUCKET,
            publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL // Optional: Custom domain for R2
        };
    } else if (provider === 'backblaze') {
        return {
            endpoint: process.env.BACKBLAZE_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com', // Must match region
            region: process.env.BACKBLAZE_REGION || 'us-west-004',
            credentials: {
                accessKeyId: process.env.BACKBLAZE_KEY_ID,
                secretAccessKey: process.env.BACKBLAZE_APP_KEY,
            },
            bucket: process.env.BACKBLAZE_BUCKET_NAME,
            publicUrl: process.env.BACKBLAZE_PUBLIC_URL || null
        };
    }

    throw new Error(`Unsupported STORAGE_PROVIDER: ${provider}`);
};

class StorageService {
    constructor() {
        this.initClient();
    }

    initClient() {
        try {
            const config = getProviderConfig();
            this.client = new S3Client({
                region: config.region,
                endpoint: config.endpoint,
                credentials: config.credentials,
                forcePathStyle: true // Needed for B2/R2 compatibility sometimes
            });
            this.bucketName = config.bucket;
            this.publicUrlBase = config.publicUrl;
            this.provider = process.env.STORAGE_PROVIDER || 'cloudflare';
            console.log(`[Storage] Initialized with provider: ${this.provider}`);
        } catch (error) {
            console.error('[StorageError] Initialization failed:', error.message);
            this.client = null;
        }
    }

    /**
     * Upload buffer to configured S3-compatible storage
     * @param {Buffer} buffer 
     * @param {string} originalName 
     * @param {string} mimetype 
     * @param {string} folderPrefix 
     * @returns {Promise<string>} public URL of uploaded file
     */
    async uploadFile(buffer, originalName, mimetype, folderPrefix = 'templates') {
        if (!this.client) throw new Error('Storage service is not initialized');

        const ext = path.extname(originalName) || '.png';
        const fileName = `${folderPrefix}/${uuidv4()}${ext}`;

        const uploadParams = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: buffer,
            ContentType: mimetype,
            // ACL: 'public-read' // Note: Backblaze B2/Cloudflare R2 permissions are often bucket-level, might need adjustments
        };

        await this.client.send(new PutObjectCommand(uploadParams));

        return this.getFileUrl(fileName);
    }

    /**
     * Delete file from storage
     * @param {string} fileKey - For example "templates/uuid.png"
     */
    async deleteFile(fileKey) {
        if (!this.client) return;
        const deleteParams = {
            Bucket: this.bucketName,
            Key: fileKey,
        };
        await this.client.send(new DeleteObjectCommand(deleteParams));
    }

    /**
     * Get the public URL. 
     * R2 and B2 handle this a bit differently depending on if you use custom domains.
     */
    getFileUrl(key) {
        if (this.publicUrlBase) {
            // Trim trailing slashes from publicUrlBase if any
            const base = this.publicUrlBase.replace(/\/$/, "");
            return `${base}/${key}`;
        }

        // Fallback URLs if public endpoints are not explicitly provided
        if (this.provider === 'backblaze') {
            const endpoint = process.env.BACKBLAZE_ENDPOINT || 'https://s3.us-west-004.backblazeb2.com';
            // B2 Public URL Format: https://f004.backblazeb2.com/file/BUCKET_NAME/key
            // Since we use S3 API, path style is typically: https://s3.region.backblazeb2.com/bucket/key
            return `${endpoint}/${this.bucketName}/${key}`;
        } else {
            // R2 without custom domain (requires workers or specific R2.dev domain which must be in env)
            return `${getProviderConfig().endpoint}/${this.bucketName}/${key}`;
        }
    }
}

module.exports = new StorageService();
