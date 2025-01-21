import { getDownloadURL, ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { storage } from './firebaseConfig';

export const uploadImage = async (
    image: File,
    onProgress: (progress: number) => void
): Promise<string> => {
    if (!image) {
        throw new Error('No image file provided');
    }

    try {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask: UploadTask = uploadBytesResumable(storageRef, image);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    onProgress(progress);
                },
                (error) => {
                    reject(new Error(error.message));
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(new Error((error as Error).message));
                    }
                }
            );
        });
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
