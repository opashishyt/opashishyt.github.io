// uploads/upload-handler.js
// यह फाइल फ्रंटएंड पर फाइल अपलोड को हैंडल करेगी

class FileUploadHandler {
    constructor() {
        this.maxImageSize = 2 * 1024 * 1024; // 2MB
        this.maxApkSize = 200 * 1024 * 1024; // 200MB
        this.allowedImageTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];
    }
    
    // इमेज वैलिडेशन
    validateImage(file) {
        return new Promise((resolve, reject) => {
            // फाइल टाइप चेक
            if (!this.allowedImageTypes.includes(file.type)) {
                reject('अमान्य इमेज फॉर्मेट। केवल JPEG, PNG, GIF, WebP स्वीकार्य हैं।');
                return;
            }
            
            // फाइल साइज चेक
            if (file.size > this.maxImageSize) {
                reject('इमेज साइज 2MB से कम होनी चाहिए।');
                return;
            }
            
            // इमेज डायमेंशन्स चेक (ऑप्शनल)
            const img = new Image();
            img.onload = () => {
                if (img.width > 2000 || img.height > 2000) {
                    reject('इमेज रेजोल्यूशन बहुत बड़ा है। अधिकतम 2000x2000 पिक्सेल।');
                } else {
                    resolve({
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height
                    });
                }
            };
            img.onerror = () => reject('इमेज लोड करने में त्रुटि');
            img.src = URL.createObjectURL(file);
        });
    }
    
    // APK वैलिडेशन
    validateApk(file) {
        return new Promise((resolve, reject) => {
            // फाइल एक्सटेंशन चेक
            if (!file.name.toLowerCase().endsWith('.apk')) {
                reject('केवल APK फाइलें स्वीकार्य हैं।');
                return;
            }
            
            // फाइल साइज चेक
            if (file.size > this.maxApkSize) {
                reject('APK साइज 200MB से कम होनी चाहिए।');
                return;
            }
            
            // फाइल नाम सैनिटाइजेशन
            const sanitizedName = this.sanitizeFileName(file.name);
            
            resolve({
                originalName: file.name,
                sanitizedName: sanitizedName,
                size: file.size,
                type: file.type
            });
        });
    }
    
    // फाइल नाम सैनिटाइजेशन
    sanitizeFileName(filename) {
        return filename
            .replace(/[^a-zA-Z0-9\.\-\_]/g, '_')  // विशेष करैक्टर्स हटाएं
            .replace(/\s+/g, '_')                 // स्पेस को अंडरस्कोर में
            .replace(/_+/g, '_')                  // मल्टीपल अंडरस्कोर को सिंगल में
            .toLowerCase();                       // लोअरकेस में कन्वर्ट
    }
    
    // फाइल अपलोड (सिमुलेशन - वास्तविक प्रोजेक्ट में बैकएंड API कॉल करें)
    uploadFile(file, type) {
        return new Promise((resolve, reject) => {
            // सिमुलेटेड अपलोड प्रोसेस
            setTimeout(() => {
                const timestamp = Date.now();
                const fileId = `file_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
                const sanitizedName = this.sanitizeFileName(file.name);
                
                // फाइल पाथ जनरेट करें
                let filePath;
                if (type === 'image') {
                    filePath = `uploads/images/${fileId}_${sanitizedName}`;
                } else if (type === 'apk') {
                    filePath = `uploads/apk/${fileId}_${sanitizedName}`;
                } else {
                    filePath = `uploads/temp/${fileId}_${sanitizedName}`;
                }
                
                // सफलता रिस्पॉन्स
                resolve({
                    success: true,
                    message: 'फाइल सफलतापूर्वक अपलोड हुई',
                    data: {
                        id: fileId,
                        name: sanitizedName,
                        originalName: file.name,
                        path: filePath,
                        size: file.size,
                        type: file.type,
                        uploadedAt: new Date().toISOString()
                    }
                });
            }, 1500); // सिमुलेशन डिले
        });
    }
    
    // प्रोग्रेस ट्रैकिंग
    trackUploadProgress(file, progressCallback) {
        // सिमुलेटेड प्रोग्रेस (वास्तविक प्रोजेक्ट में XMLHttpRequest या Fetch API का उपयोग करें)
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progressCallback) {
                progressCallback(progress);
            }
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
        
        return interval;
    }
    
    // मल्टीपल फाइल्स अपलोड
    uploadMultipleFiles(files, type) {
        const uploadPromises = files.map(file => this.uploadFile(file, type));
        return Promise.all(uploadPromises);
    }
    
    // फाइल डिलीट (सिमुलेशन)
    deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // वास्तविक प्रोजेक्ट में सर्वर पर DELETE रिक्वेस्ट भेजें
                resolve({
                    success: true,
                    message: 'फाइल सफलतापूर्वक डिलीट हुई',
                    data: { filePath }
                });
            }, 500);
        });
    }
    
    // इमेज प्रीव्यू जनरेटर
    generateImagePreview(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject('यह एक इमेज फाइल नहीं है');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.onerror = () => reject('इमेज रीड करने में त्रुटि');
            reader.readAsDataURL(file);
        });
    }
    
    // फाइल साइज फॉर्मेटर
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// ग्लोबल एक्सेस के लिए
window.FileUploadHandler = FileUploadHandler;