import React from "react"

const Icon = (props) => {

    const { img, name } = props;

    return (
        <div className="flex justify-center gap-5">
            <div>
                <img
                    src={img}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            </div>
            <div className="flex justify-center items-center">
                <p className="text-lg">
                    {name}
                </p>
            </div>
        </div>
    )
}

export default Icon