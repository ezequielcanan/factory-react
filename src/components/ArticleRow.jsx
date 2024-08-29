import { getArticleImg } from "../utils/utils"

const ArticleRow = ({article}) => {
  return (
    <div className="flex justify-between gap-4 text-white border-2 border-action rounded p-4">
      <p className="text-xl">{article?.description || article?.detail}</p>
      <p className="text-2xl border-l-4 border-action pl-4 font-bold">{article?.quantity}</p>
    </div>
  )
}

export default ArticleRow