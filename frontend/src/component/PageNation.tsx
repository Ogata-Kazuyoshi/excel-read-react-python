import {Dispatch, SetStateAction} from "react";

type Props = {
    selectedColumnIndex: number
    setSelectedColumnIndex: Dispatch<SetStateAction<number>>
    numberOfTitle: number
}
export const PageNation = (props:Props) => {
    return (
        <div>
            <button onClick={() => {
                if (props.selectedColumnIndex !== 0) props.setSelectedColumnIndex(props.selectedColumnIndex - 1)
            }}
            >前へ
            </button>
            <button onClick={() => {
                if (props.selectedColumnIndex < props.numberOfTitle - 1) props.setSelectedColumnIndex(props.selectedColumnIndex + 1)
            }}>次へ
            </button>
        </div>
    )
}