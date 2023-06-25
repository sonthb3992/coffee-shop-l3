import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducer/store';
import { v4 as uuidv4 } from 'uuid';

interface ChallengeImageUploaderProps {
  onImageUrlChanged: (newUrl: string) => void;
}

const ChallengeImageUploader: React.FC<ChallengeImageUploaderProps> = ({
  onImageUrlChanged,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const user = useSelector((state: RootState) => state.cart.user);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const uploadChallenge = async (file: File) => {
    const storage = getStorage();
    const storageRef = ref(storage, 'challenges/' + uuidv4().toLowerCase());
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleUpload = async () => {
    if (selectedImage) {
      try {
        const downloadURL = await uploadChallenge(selectedImage);
        setUploadedImageUrl(downloadURL);
        onImageUrlChanged(downloadURL);
        console.log('Challenge uploaded:', downloadURL);
      } catch (error) {
        console.log('Error uploading challange:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div className="flex is-flex-direction-column">
          <figure className="image">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Selected Challenge"
                width="128"
                height="128"
              />
            )}
            {!user?.photoURL && (
              <figure className="image is-128x128">
                <img
                  src={uploadedImageUrl}
                  alt="Selected Challenge"
                  width="128"
                  height="128"
                />
              </figure>
            )}
          </figure>
          <button onClick={handleUpload}>Upload Challenge</button>
        </div>
      )}
    </div>
  );
};

export default ChallengeImageUploader;
