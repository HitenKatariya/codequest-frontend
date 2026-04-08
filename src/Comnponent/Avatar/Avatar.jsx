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
    
    // Handle legacy local uploads
    if (avatar && avatar.startsWith('/uploads/')) {
	  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';
	  avatarUrl = `${base}${avatar}`;
	}
    // Cloudinary URLs come as full URLs, so we use them as-is
    
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
