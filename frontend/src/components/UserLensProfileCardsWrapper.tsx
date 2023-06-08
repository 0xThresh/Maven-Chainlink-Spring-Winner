import { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserLensProfileCards from "./UserLensProfileCards";

interface IUserProfileCardsWrapper {
  profileList: string[];
  parentSetter: Dispatch<SetStateAction<number>>;
}

const UserLensProfileCardsWrapper = ({profileList, parentSetter}: IUserProfileCardsWrapper) => {
  const [selected, setSelected] = useState<number>();

  return (
    <div className="grid grid-cols-3 gap-4">
      {profileList.map((profile, index) => 
      <div key={index} onClick={() => {
        setSelected(index)
        parentSetter(index)
      }} className=" cursor-pointer">
        <UserLensProfileCards profileName={profile} isSelected={index === selected} />
      </div>
      )}
    </div>
  )
}

export default UserLensProfileCardsWrapper