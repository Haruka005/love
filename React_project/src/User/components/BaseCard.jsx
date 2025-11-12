// カードの見た目を共通化
export default function BaseCard({ title, text, image, children }) {
  return (
    <div className="card">

      {/* 画像 */}
      {image && (
        <img
          src={image}
          alt={title || ""}
        />
      )}

      {/* コンテンツ部分 */}
      <div className="card-content">
        {children ? (
          children
        ) : (
          <>
            {title && (
              <h3>{title}</h3>
            )}
            {text && <p>{text}</p>}
          </>
        )}
      </div>
    </div>
  );
}
