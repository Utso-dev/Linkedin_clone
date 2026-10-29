import { BsFillShieldLockFill } from "react-icons/bs";

function ProfileLockDesign() {
  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center w-full mx-auto my-6">
        {/* Shield Lock Icon with Dual Badge Glow */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center border-8 border-blue-50/50">
            <BsFillShieldLockFill className="w-9 h-9 text-primaryColor" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primaryColor rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          This Profile is Private
        </h3>

        {/* Descriptive Text */}
        <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">
          The profile owner has locked their profile to protect their privacy.
          Profile information is therefore restricted and cannot be viewed
          publicly.
        </p>
      </div>
    </div>
  );
}

export default ProfileLockDesign;
