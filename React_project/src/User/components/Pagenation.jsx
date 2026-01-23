function Pagenation({ totalPages, currentPage, onPageChange }) {
  //if (totalPages <= 1) return null; // ページ数1以下なら表示しない

  // ページネーションコンポーネント
  return (
    <div style={{ marginTop: "20px" }}>
      {/* 前へボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="button"
      >
        ＜
      </button>

      {/* ページ番号ボタン */}
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            borderRadius: "5px",
            backgroundColor:
              currentPage === i + 1 ? "#ff6666" : "#eee",
            color: currentPage === i + 1 ? "#fff" : "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          {i + 1}
        </button>
      ))}

      {/* 次へボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="button"
      >
        ＞
      </button>
    </div>
  );
}

export default Pagenation;
