import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';

interface AvatarUploaderProps {
    onImageUrlChanged: (newUrl: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onImageUrlChanged }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const user = useSelector((state: RootState) => state.cart.user);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const uploadAvatar = async (file: File) => {
        const storage = getStorage();
        const storageRef = ref(storage, 'avatars/' + file.name);
        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleUpload = async () => {
        if (selectedImage) {
            try {
                const downloadURL = await uploadAvatar(selectedImage);
                setUploadedImageUrl(downloadURL);
                onImageUrlChanged(downloadURL);
                console.log('Avatar uploaded:', downloadURL);
            } catch (error) {
                console.log('Error uploading avatar:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
                <div className='flex is-flex-direction-column'>
                    <figure className='image'>
                        {user?.photoURL && <img src={user.photoURL} alt="Selected Avatar" width="128" height="128" />}
                        {!user?.photoURL && <img src={uploadedImageUrl} alt="Selected Avatar" width="128" height="128" />}
                    </figure>
                    <button onClick={handleUpload}>Upload Avatar</button>
                </div>
            )}
        </div>
    );
};

export default AvatarUploader;
