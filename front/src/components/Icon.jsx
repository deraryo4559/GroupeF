import React from "react"

const Icon = (props) => {

    const { img, name } = props;

    return (
        <div className="flex justify-center w-full space-x-20">
            <div>
                <img
                    src={img}
                    className="h-16 w-16 rounded-full object-cover flex-shrink-0" />
            </div>
            <div className="flex justify-center items-center">
                <p className="text-xl">
                    {name}
                </p>
            </div>
        </div>
    )
}

export default Icon