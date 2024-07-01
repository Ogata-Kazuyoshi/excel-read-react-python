import {Dispatch, SetStateAction, useRef} from "react";

type Props = {
    setMaxYValue: Dispatch<SetStateAction<number | undefined>>
}

export const ChangeGraphScale = (props:Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    return(
        <div>
            <label>Y軸の最大値変更</label>
            <input type={"number"} ref={inputRef}/>
            <button onClick={() => {
                if (inputRef.current!.value) {
                    props.setMaxYValue(+inputRef.current!.value)
                } else {
                    props.setMaxYValue(undefined)
                }
            }}>決定
            </button>
        </div>
    )
}