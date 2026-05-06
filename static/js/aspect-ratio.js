const img = new Image();
img.src = "../../images/towernobg.png"; // use the correct path

img.onload = function () {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const aspectRatio = width / height;

  console.log("Width:", width);
  console.log("Height:", height);
  console.log("Aspect ratio:", aspectRatio);

  // Example: set CSS dynamically
  const editedimage = document.getElementById("editedimage");
  editedimage.style.aspectRatio = `${width} / ${height}`;
};
