import domtoimage from "dom-to-image-more";

const node = document.getElementById("myElement");

domtoimage.toPng(node, { bgcolor: "transparent" }).then((dataUrl) => {
  const link = document.createElement("a");
  link.download = "my-element.png";
  link.href = dataUrl;
  link.click();
});
