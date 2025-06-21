import React from 'react'

function Avatar({
    children,
    backgroundColor,
    px,
    py,
    color,
    borderRadius, fontSize, cursor,
    avatar,
    style: customStyle // allow style override
}) {
    let avatarUrl = avatar;
    if (avatar && avatar.startsWith('/uploads/')) {
      // Remove any accidental double slashes
      avatarUrl = `https://codequest-backend-wmll.onrender.com${avatar}`;
    }
    // If avatar is a string and not empty, show image
    if (avatar && typeof avatar === 'string' && avatar.trim() !== '') {
      return (
        <img src={avatarUrl} alt="avatar" style={{
          width: customStyle?.width || 48,
          height: customStyle?.height || 48,
          borderRadius: '50%',
          objectFit: 'cover',
          ...customStyle
        }} />
      );
    }
    // Only show colored background if no avatar
    const style = {
        backgroundColor,
        padding: `${py} ${px}`,
        color: color || "black",
        borderRadius,
        fontSize,
        textAlign: "center",
        cursor: cursor || null,
        textDecoration: "none",
        width: customStyle?.width || 48,
        height: customStyle?.height || 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...customStyle
    };
    return (
      <div style={style}>{children}</div>
    )
}

export default Avatar
