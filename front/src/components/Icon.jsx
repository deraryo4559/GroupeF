import React from "react"

const Icon = (props) => {
    const { img, name } = props;

    return (
        // 変更点1: レイアウトをシンプルに。要素を垂直方向に中央揃えし、要素間のスペースを指定
        <div className="flex w-full items-center space-x-4 px-4">
            {/* アイコン部分 (変更なし、ただし念のためflex-shrink-0を追加) */}
            <div className="flex-shrink-0">
                <img
                    src={img}
                    className="h-16 w-16 rounded-full object-cover"
                />
            </div>
            {/* 変更点2: このdivが残りのスペースを全て使い、はみ出さないように設定 */}
            <div className="flex-1 min-w-0">
                {/* 変更点3: truncateクラスを追加してテキストを省略 */}
                <p className="truncate text-gray-900 text-xl font-bold leading-tight">
                    {name}
                </p>
            </div>
        </div>
    )
}

export default Icon;