/**
 * @description 高亮
 */
export const highlightHtml = (content, key) => {
  content = content.replace(/(\r\n|\n|\r)/gm, "<br />");
  var replaceReg = new RegExp(key, 'g')
  var replaceString = '<span class="highlights-text">' + key + '</span>';
  content = content.replace(replaceReg, replaceString);
  return content;
}


/**
 * @richTextChange 富文本
 */
export const richTextChange = (str) => {
  let richText = unescape(str);
  richText = richText
    .replace(/\<pre/gi, `<div class="container-pre"><img class="container-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDU0IDE0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEgMSkiPjxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSI2IiBmaWxsPSIjRkY1RjU2IiBzdHJva2U9IiNFMDQ0M0UiIHN0cm9rZS13aWR0aD0iLjUiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjI2IiBjeT0iNiIgcj0iNiIgZmlsbD0iI0ZGQkQyRSIgc3Ryb2tlPSIjREVBMTIzIiBzdHJva2Utd2lkdGg9Ii41Ij48L2NpcmNsZT48Y2lyY2xlIGN4PSI0NiIgY3k9IjYiIHI9IjYiIGZpbGw9IiMyN0M5M0YiIHN0cm9rZT0iIzFBQUIyOSIgc3Ryb2tlLXdpZHRoPSIuNSI+PC9jaXJjbGU+PC9nPjwvc3ZnPg=="><pre style="overflow:auto;" class="pre"`)
    .replace(/\<\/pre>/gi, `</pre></div>`)
    .replace(/\<blockquote/gi, `<blockquote class="blockquote"`)
  return richText;
}

/**
 * @trim 去空格
 */
export const Trim = (str) => {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
