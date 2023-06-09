interface IUserProfileCard {
  profileName: string;
  isSelected?: boolean;
}
const UserLensProfileCards = ({ profileName, isSelected=false }: IUserProfileCard) => {
  return (
    <div className={`w- w-28 h-10 border-2 border-slate-800 py-1 px-2 overflow-hidden ${isSelected && "bg-slate-800 text-white"}`}>
      {profileName}
    </div>
  );
};

export default UserLensProfileCards;