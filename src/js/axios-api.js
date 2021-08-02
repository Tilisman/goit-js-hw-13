import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, galleryList, buttonLoadMore} = refs;


const baseUrl = "https://pixabay.com/api/";
axios.defaults.baseURL = baseUrl;
const apiKey = "22755987-36fd69adb1f8e5ac892f6e414";

const myFetch = getFetch();
const { setQuery, getImages, loadMore, resetPage, resetTotal, resetHit, message } = myFetch;

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let query = evt.target.elements.searchQuery.value.trim()
    if (query === "") {
         return;
    };
    list.innerHTML = "";
    resetPage();
    resetTotal();
    resetHit();
    setQuery(query);
    getImages();
    setTimeout(() => {
        message();
    }, 1000);
    buttonLoadMore.classList.remove("is-hidden");
    form.reset();
});

loadMore(more);

function getFetch() {
    let page = 1;
    let per_page = 40;
    let query = "";
    let hit = 0;
    let total = 0;

    function resetTotal() {
        return total = 0;
    }
    function resetHit() {
        return hit = 0;
    }
    function setPage() {
        return page += 1;
    }
    function resetPage() {
        return page = 1;
    }
    function setQuery(value) {
        return query = value;
    }
    async function getImages() {
        let queryParams = `?key=${apiKey}&q=${query}&image_type=photo&per_page=${per_page}&page=${page}&orientation=horizontal&safesearch=true`;
        let url = baseUrl + queryParams;
        
        const response = await axios.get(url);
        const data = response.data;
        const photo = data.hits;
        const totalHits = data.totalHits;

        generateGallery(photo, totalHits);
        hit = totalHits;
    }
    function generateGallery(photo, totalHits) {
        const gallery = cardTpl(photo);
        total += photo.length;
        console.log(totalHits);
        console.log(total);
        if (photo.length === 0) {
            buttonLoadMore.classList.add("is-hidden");
            return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
            else if (total >= totalHits) {
                list.insertAdjacentHTML("beforeend", gallery);
                buttonLoadMore.classList.add("is-hidden");
                return setTimeout(() => {
                    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                }, 300);
        }
        list.insertAdjacentHTML("beforeend", gallery);
        openSimpleLightboxModal();
        pageScroll()
        return total;
    }
    function message() {
            if (hit === 0) {
                return;
        }
            return Notiflix.Notify.info(`Hooray! We found ${hit} images.`);
    }
    function loadMore(button) {
            button.addEventListener("click", () => {
                setPage();
                getImages();
            });
    }
    function openSimpleLightboxModal() {
        const lightbox = new SimpleLightbox('.gallery a', {elements: '.gallery a'} );
        lightbox.on('show.simplelightbox', function () {
            galleryList.addEventListener('click', evt => evt.preventDefault());
        });
    }
    function pageScroll() {
            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();
                window.scrollBy({
                    top: cardHeight * 2,
                    behavior: 'smooth',
                });
    }
    return { setQuery, loadMore, resetPage, getImages, message, resetTotal, resetHit};
}


    


 
   




