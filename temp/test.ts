let images = [];
let selectedImages = [];

// random data into images
for (let i = 0; i < 10; i++) {
  images.push(
    Math.random()
  );
}

// random selected from images and can't be duplicated
for (let i = 0; i < 5; i++) {
  let randomIndex = Math.floor(Math.random() * images.length);
  selectedImages.push(images[randomIndex]);
  images.splice(randomIndex, 1);
}
