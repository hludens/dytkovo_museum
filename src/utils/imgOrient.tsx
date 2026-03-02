function getImageOrientation(imageUrl:string|undefined) {
  if (!imageUrl) return 'horizontal';
  const img = new Image();
  img.src = imageUrl;
  return img.width > img.height ? 'horizontal' : 'vertical';
}
export default getImageOrientation;