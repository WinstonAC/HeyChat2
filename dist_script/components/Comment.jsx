'use client';
const Comment = ({ comment }) => {
    const formattedDate = comment.created_at
        ? new Date(comment.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        : 'Date not available';
    // isOwnComment logic and related conditional classes removed for simplicity with string author
    const commentBoxClasses = "bg-gray-800 p-4 rounded-lg shadow mb-4 mr-auto max-w-[85%] md:max-w-[75%]";
    const textAlignClass = "text-left";
    const headerAlignClass = "flex items-center mb-2";
    const avatarMarginClass = "mr-3"; // Default avatar alignment
    return (<div className={commentBoxClasses}>
      <div className={headerAlignClass}>
        {/* Placeholder for user avatar */}
        <div className={`w-8 h-8 rounded-full bg-gray-600 ${avatarMarginClass} flex-shrink-0`}></div>
        {/* Use comment.author from the new schema */}
        <h5 className={`font-semibold text-blue-400`}>{comment.author || 'Anonymous'}</h5> 
      </div>
      {/* Use comment.text from the new schema */}
      <p className={`text-gray-300 whitespace-pre-wrap ${textAlignClass}`}>{comment.text}</p>
      <p className={`text-xs text-gray-500 mt-2 ${textAlignClass}`}>{formattedDate}</p>
    </div>);
};
export default Comment;
