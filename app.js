const buildPageSelector = document.getElementById('build');
const predictPageSelector = document.getElementById('predict');
const homePageSelector = document.getElementById('home');
function locationHashChanged() {
  if (location.hash === '#build') {
    buildPageSelector.style.display = 'initial';
    predictPageSelector.style.display = 'none';
    homePageSelector.style.display = 'none';
  } else if (location.hash === '#predict') {
    buildPageSelector.style.display = 'none';
    predictPageSelector.style.display = 'initial';
    homePageSelector.style.display = 'none';
  } else {
    buildPageSelector.style.display = 'none';
    predictPageSelector.style.display = 'none';
    homePageSelector.style.display = 'initial';
  }
}

window.onhashchange = locationHashChanged;
buildPageSelector.style.display = 'none';
predictPageSelector.style.display = 'none';
homePageSelector.style.display = 'initial';
