  import { useState, ChangeEvent } from 'react';
  import { Camera } from 'lucide-react';

  interface ProfileAvatarProps {
    username: string;
    profilePicture: string | null;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }

  export default function ProfileAvatar({ 
    username, 
    profilePicture, 
    onFileChange 
  }: ProfileAvatarProps) {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    return (
      <div className="relative w-40 h-40">
        <div 
          className="relative w-full h-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {profilePicture ? (
            <img
              className="w-full h-full rounded-md object-cover"
              src={profilePicture}
              alt={`${username}'s Profile`}
            />
          ) : (
            <div className="w-full h-full rounded-md bg-gray-300 flex items-center justify-center">
              <span className="text-xl text-white">Зураг тавиагүй</span>
            </div>
          )}
          
          {/* Hover overlay */}
          {isHovering && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
              <label className="cursor-pointer flex flex-col items-center">
                <Camera className="w-8 h-8 text-white mb-2" />
                <span className="text-white text-sm">Зураг солих</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </label>
            </div>
          )}
        </div>

        {/* Online status indicator */}
        <div
          className="absolute -right-3 bottom-5 h-5 w-5 rounded-full border-4 border-white bg-green-400"
          title="User is online"
        />
      </div>
    );
  }