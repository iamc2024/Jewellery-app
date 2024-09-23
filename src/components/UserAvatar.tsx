import Image from "next/image";
import avatarPlaceHolder from '@/assets/avatar-placeholder.png'
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string,
  size?: number
}

const UserAvatar = (
  { className, size }: UserAvatarProps
) => {
  return (
    <Image
      src={avatarPlaceHolder}
      alt='avatarplaceholder'
      height = {size ?? 48}
      width = {size ?? 48}
      className={cn("aspect-square h-fit flex-none rounded-2xl bg-secondary object-cover", className)}
    />
  )
}

export default UserAvatar