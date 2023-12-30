import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

document.addEventListener("DOMContentLoaded", function () {
   const container = document.querySelector(".card-columns");
   // const imageApiUrl = "https://api.thedogapi.com/v1/images/search?limit=50";
   const imageApiUrl = "https://api.thedogapi.com/v1/images/search?limit=25&order=RANDOM&size=small&mime_types=jpg&has_breeds=1&include_breeds=1";
   const breedsApiUrl = "https://api.thedogapi.com/v1/breeds";
   const apiKey = "206c4f7f-d43c-4e18-9e3e-2a8f14633d1f"; // Replace with your actual API key

   // Set padding of body to the height of navbar
   $("body").css("padding-top", $(".navbar").outerHeight() + "px");

   let breeds = [];

   function createCard(imageUrl, breed) {
      const card = document.createElement("div");

      card.className = "card card-pin";
      card.innerHTML = `
         <img class="card-img" src="${imageUrl}" alt="${breed.name}"/>
         <div class="overlay">
            <div id="card-${breed.id}" class="card-title title">${breed.name}</div>
         </div>
      `;
      card.addEventListener("click", () => openModal(imageUrl, breed)); // Pass the breed object

      const likeBtn = document.createElement("i");
      likeBtn.className = "fa-solid fa-heart like-btn";
      likeBtn.addEventListener("click", (event) => {
         event.stopPropagation();
         toggleLike(imageUrl, breed, likeBtn);
      });
      card.appendChild(likeBtn);

      // Check if the image is already liked
      updateLikeStatus(imageUrl, likeBtn);

      // on mouseover add decypt effect to the title
      card.addEventListener("mouseover", () => {
         Scrambler({
            target: "#card-" + breed.id,
            random: [100, 500],
            speed: 100,
         });
      });

      return card;
   }

   // Update like button based on local storage
   function updateLikeStatus(imageUrl, likeBtn) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      if (favorites[imageUrl]) {
         likeBtn.classList.add("liked");
      } else {
         likeBtn.classList.remove("liked");
      }

      //add the card to the favorites tab
   }

   // Function to display favorites
   function showFavorites() {
      const favoritesContainer = document.getElementById("card-columns-fav");
      favoritesContainer.innerHTML = ""; // Clear existing content in favorites tab

      const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      Object.keys(favorites).forEach((imageUrl) => {
         const breed = favorites[imageUrl];
         const card = createCard(imageUrl, breed);
         favoritesContainer.appendChild(card); // Append to favorites tab
      });

      // If no favorites, show a message in the favorites tab
      if (Object.keys(favorites).length === 0) {
         favoritesContainer.innerHTML = "<p class='w-100 text-center my-5 text-white'>No favorites selected.</p>";
      }
   }

   // Toggle like status
   function toggleLike(imageUrl, breed, likeBtn) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
      if (favorites[imageUrl]) {
         delete favorites[imageUrl];
      } else {
         favorites[imageUrl] = breed;
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      updateLikeStatus(imageUrl, likeBtn); // Update the like status after toggling
   }

   function fetchBreedInfo() {
      return fetch(breedsApiUrl, { headers: { "x-api-key": apiKey } })
         .then((response) => response.json())
         .then((data) => {
            breeds = data;
         });
   }

   function addDogImages(callback) {
      fetch(imageApiUrl, { headers: { "x-api-key": apiKey } })
         .then((response) => response.json())
         .then((images) => {
            images.forEach((image) => {
               // Check if there is breed information attached to the image
               if (image.breeds && image.breeds.length > 0) {
                  const breed = image.breeds[0]; // Take the first breed from the array
                  const card = createCard(image.url, breed);
                  container.appendChild(card);
               }
               if (callback) callback();
            });
         })
         .catch((error) => console.error("Error:", error));
   }

   function openModal(imageUrlFromClick, breed) {
      const modal = $("#dogModal");

      modal.find(".dog-info").html(`
      <div class="d-flex text-white text-sm text-uppercase">
      <div class="animated-background me-3">
         <img class="img-fluid dna" src="assets/img/dog.gif" />
      </div>

      <div>
         <div class="font-weight-bold m-0 opacity-50">Dudus:</div>
         <h5 id="modaltitle" class="font-weight-bold mb-3">${breed.name}</h6>
         <div class="d-flex">
            <div class="d-flex align-items-center info-label">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide text-green lucide-weight me-2"
               >
                  <circle cx="12" cy="5" r="3" />
                  <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
               </svg>
               <strong>Weight:</strong>
            </div>
            <div>${breed.weight.metric} kg</div>
         </div>
         <div class="d-flex">
            <div class="d-flex align-items-center info-label">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide text-green lucide-ruler me-2"
               >
                  <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
                  <path d="m14.5 12.5 2-2" />
                  <path d="m11.5 9.5 2-2" />
                  <path d="m8.5 6.5 2-2" />
                  <path d="m17.5 15.5 2-2" />
               </svg>
               <strong>Height:</strong>
            </div>
            <div>${breed.height.metric} cm</div>
         </div>
         <div class="d-flex">
            <div class="d-flex align-items-center info-label">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide text-green lucide-activity me-2"
               >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
               </svg>
               <strong>Life Span:</strong>
            </div>
            <div>${breed.life_span}</div>
         </div>
         <div class="d-flex">
            <div class="d-flex align-items-center info-label">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide text-green lucide-map-pinned me-2"
               >
                  <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0" />
                  <circle cx="12" cy="8" r="2" />
                  <path d="M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835" />
               </svg>
               <strong>Origin:</strong>
            </div>
            <div>${breed.origin}</div>
         </div>
         <div class="d-flex">
            <div class="d-flex align-items-center info-label">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide text-green lucide-bone me-2"
               >
                  <path
                     d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"
                  />
               </svg>
               <strong>Temperament:</strong>
            </div>
            <div>${breed.temperament}</div>
         </div>
      </div>
   </div>
    `);

      const imageUrl = `https://api.thedogapi.com/v1/images/search?breed_id=${breed.id}&limit=10&size=small&mime_types=jpg&order=RANDOM`;

      fetch(imageUrl)
         .then((response) => response.json())
         .then((images) => populateSwiper(images))
         .catch((error) => console.error("Error fetching images:", error));

      modal.modal("show");

      Scrambler({
         target: "#modaltitle",
         random: [200, 1000],
         speed: 100,
         beforeEach: function (element) {
            console.log(`${element} about to scramble`);
         },
         afterAll: function (elements) {
            console.log("all done!");
         },
      });
   }

   function populateSwiper(images) {
      const swiperWrapper = document.querySelector(".swiper-wrapper");
      swiperWrapper.innerHTML = ""; // Clear existing slides

      images.forEach((image) => {
         const slide = document.createElement("div");
         slide.className = "swiper-slide";
         slide.innerHTML = `<img src="${image.url}" alt="Breed Image">`;
         swiperWrapper.appendChild(slide);
      });

      document.querySelector(".dog-images").classList.add("fade-in");

      // Update Swiper
      swiperInstance.update();
   }

   function initializeSwiper() {
      return new Swiper(".swiper-container", {
         // Swiper options like slidesPerView, loop, etc.
         pagination: {
            el: ".swiper-pagination",
         },
         navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
         },
         scrollbar: {
            el: ".swiper-scrollbar",
         },
         spaceBetween: 30,
         on: {
            init: function () {
               updateProgressBar(0); // Initialize the progress bar
            },
            slideChange: function () {
               updateProgressBar(this.realIndex); // Update on slide change
            },
            update: function () {
               // Reset slide to the first slide without animation
               updateProgressBar(this.realIndex);
               this.slideTo(0, 0);
            },
            afterUpdate: function () {},
         },

         // set buttons to .next and .prev instead of .swiper-button-next and .swiper-button-prev
         navigation: {
            nextEl: ".next",
            prevEl: ".prev",
         },
      });
   }

   // on modal open add decypt effect to the title

   let swiperInstance; // Swiper instance

   swiperInstance = initializeSwiper();

   function updateProgressBar(currentIndex) {
      if (!swiperInstance) return; // Check if initialized
      const totalSlides = swiperInstance.slides.length; // Total number of slides
      const percentage = ((currentIndex + 1) / totalSlides) * 100; // Calculate percentage

      const progressBar = document.querySelector(".dog-analysis .bar"); // Get the progress bar
      progressBar.style.width = percentage + "%"; // Update the width of the progress bar
   }

   fetchBreedInfo().then(() => {
      addDogImages();
      showFavorites();
   });

   const fetchBtn = document.getElementById("fetch");

   fetchBtn.addEventListener("click", () => {
      fetchBtn.innerHTML = " Throwing the ball...";

      function afterImagesAdded() {
         fetchBtn.innerHTML = "Fetch even more dudusse!";
      }

      fetchBreedInfo().then(() => {
         addDogImages(afterImagesAdded);
      });
   });

   const lenis = new Lenis();

   lenis.on("scroll", (e) => {});

   function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
   }

   requestAnimationFrame(raf);

   document.getElementById("nav-browser-tab").addEventListener("mouseover", () => {
      Scrambler({
         target: "#nav-browser-tab",
         random: [100, 500],
         speed: 100,
      });
   });
   document.getElementById("nav-fav-tab").addEventListener("mouseover", () => {
      Scrambler({
         target: "#nav-fav-tab",
         random: [100, 500],
         speed: 100,
      });
   });

   $("#nav-tab").on("show.bs.tab", function (e) {
      const targetTab = e.target.getAttribute("href"); // Get the target tab ID
      //find the top pane
      const tab = document.querySelector(`${targetTab}`);
      const topPane = tab.querySelector(".top-pane");

      showFavorites();

      const cards = tab.querySelectorAll(".card");

      anime({
         targets: cards,
         opacity: [0, 1],
         scale: [0.95, 1],
         easing: "spring(1, 80, 9, 1)",
         duration: 100,
         delay: anime.stagger(20),
         direction: "forward",
      });

      anime({
         targets: topPane,
         opacity: [0, 1],
         translateY: [50, 0], // Start from 50px right and move to original position
         easing: "spring(1, 80, 9, 1)",
         duration: 500,
         delay: 0,
         direction: "forward",
      });
   });

   $("#dogModal").on("show.bs.modal", function (e) {
      Scrambler({
         target: "#modaltitle",
         random: [200, 1000],
         speed: 100,
         beforeEach: function (element) {
            console.log(`${element} about to scramble`);
         },
         afterAll: function (elements) {
            console.log("all done!");
         },
      });

      anime({
         targets: ".tab-content",
         scale: [1, 0.95],
         easing: "spring(1, 80, 15, 10)",
         duration: 150,
         delay: 0,
         direction: "forward",
      });

      anime({
         targets: ".modal-content",
         opacity: [0, 1],
         translateY: [-100, 0], // Start from 50px right and move to original position
         easing: "spring(1, 100, 10, 10)",
         duration: 300,
         delay: 0,
         direction: "forward",
      });
   });

   $("#dogModal").on("hide.bs.modal", function (e) {
      anime({
         targets: ".tab-content",
         scale: [0.95, 1],
         easing: "spring(1, 80, 15, 10)",
         duration: 150,
         delay: 0,
         direction: "forward",
      });
   });

   // Wrap every letter in a span
   const texts = document.querySelectorAll(".loading-text");
   texts.forEach((text) => {
      text.innerHTML = text.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
   });

   // Wrap every letter in a span
   const textWrapper = document.querySelector(".loading-screen-text-1");
   textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

   function updateLoadingBar() {
      const mytimeline = anime
         .timeline({
            loop: false,
            direction: "forward",
         })
         .add({
            targets: ".loading-screen-text-1 .letter",
            opacity: [0, 1],
            easing: "easeInOutQuad",
            duration: 100,
            delay: anime.stagger(50, { start: 0 }),
            direction: "forward",
         })
         .add({
            targets: ".loading-bar-fill",
            width: "60%",
            easing: "linear",
            duration: 500,
            delay: 500,
            direction: "forward",
         })
         .add({
            targets: ".loading-text-1",
            height: [0, 20], // Height animation for loading text
            opacity: [0, 1],
            easing: "linear",
            duration: 200,
            direction: "forward",
            delay: 0,
            begin: function () {
               anime({
                  targets: ".loading-text-1 .letter",
                  opacity: [0, 1],
                  easing: "easeInOutQuad",
                  duration: 100,
                  delay: anime.stagger(30, { start: 0 }),
               });
            },
         })
         .add({
            targets: ".loading-text-2",
            height: [0, 20], // Height animation for loading text
            opacity: [0, 1],
            easing: "linear",
            duration: 200,
            delay: 500,
            direction: "forward",
            begin: function () {
               document.querySelector(".loading-text-1").classList.add("flicker");
               anime({
                  targets: ".loading-text-2 .letter",
                  opacity: [0, 1],
                  easing: "easeInOutQuad",
                  duration: 100,
                  delay: anime.stagger(30, { start: 100 }),
               });
            },
         })
         .add({
            targets: ".loading-bar-fill",
            width: "80%",
            easing: "linear",
            duration: 200,
            delay: 200,
            direction: "forward",
         })
         .add({
            targets: ".loading-bar-fill",
            width: "100%",
            easing: "linear",
            duration: 200,
            delay: 600,
            direction: "forward",
         })
         .add({
            targets: ".loading-text-3",
            height: [0, 20], // Height animation for loading text
            opacity: [0, 1],
            easing: "linear",
            duration: 200,
            delay: 700,
            begin: function () {
               document.querySelector(".loading-text-3").classList.add("flicker");
               anime({
                  targets: ".loading-text-3 .letter",
                  opacity: [0, 1],
                  easing: "easeInOutQuad",
                  duration: 100,
                  delay: anime.stagger(30),
               });
            },

            complete: function () {
               setTimeout(() => {
                  window.scrollTo(0, 0);

                  anime({
                     targets: ".loading-screen-content",
                     opacity: [1, 0],
                     scale: [1, 0.95],
                     easing: "easeInQuad",
                     duration: 300,
                     delay: 0,
                     direction: "forward",
                     complete: function () {
                        document.querySelector(".loading-screen").style.display = "none";

                        //animate the navbar in
                        anime({
                           targets: ".navbar",
                           opacity: [0, 1],
                           translateY: [-40, 0], // Start from 50px right and move to original position
                           scale: [0.98, 1],
                           duration: 200,
                           delay: 200,
                           direction: "forward",
                           easing: "spring(1, 50, 9, 1)",
                        });

                        anime({
                           targets: ".tab-content",
                           opacity: [0, 1],
                           translateY: [40, 0], // Start from 50px right and move to original position
                           scale: [0.98, 1],
                           duration: 200,
                           delay: 200,
                           direction: "forward",
                           easing: "spring(1, 50, 9, 1)",
                        });
                     },
                  });
               }, 1500);
            },
         });
   }

   // Call the function to start the loading process
   updateLoadingBar();
});
