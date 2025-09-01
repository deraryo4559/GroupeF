const Icon = () => {
    return (
        <div className="flex justify-center gap-5">
            <div>
                <img
                    src="../images/human1.png"
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            </div>
            <div className="flex justify-center items-center">
                <p className="text-lg">
                    サンプル氏名
                </p>
            </div>
        </div>
    )
}

export default Icon