import emptyImg from "@/public/empty_user.jpg";
import Image from "next/image";
import Link from "next/link";
interface PostLikeListCardProps {
  like: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}
function PostLikeListCard({ like }: PostLikeListCardProps) {
  return (
    <div>
      <Link
        href={`/mu/profile/${like.id}`}
        className="p-2 flex items-center gap-3 border-b border-borderColor"
      >
        <div className="w-8 h-8 border border-primaryColor rounded-full">
          <Image
            src={like?.profile_image || emptyImg}
            alt="Profile Image"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <p className="text-sm font-semibold text-headerColor">
          {like?.name || "Unknown User"}
        </p>
      </Link>
    </div>
  );
}

export default PostLikeListCard;
