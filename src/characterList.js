const characterItem = ({
  id,
  name,
  status,
  species,
  image,
  location,
  origin,
  created,
  episode,
}) => `

<div data-id="${id}"> 
<article class='character-card-wrapper'>
<div class='img-wrapper'><img src="${image}" align="top"/></div>
<div class='character-card-content-wrapper'>

<div class='section'>
<a class='name-wrapper-czxdz'>
<h2 class='line-limit-length'>${name}</h2>
</a>
<span class='status'>${status} - ${species}</span>
</div>
<div class='section'>
<span class="text-gray">Last known location: </span>
<a>${location.name}</a>
</div>
<div class='section'>
<span class="text-gray">First seen in: </span>
<a>${origin.name}</a>
</div>
<div class='section'>
<span class="text-gray">Created at: </span>
<a>${created.slice(0, 4)} ${created.slice(5, 10)} ${created.slice(11, 19)}</a>
</div>
<div class='section'>
<span class="text-gray">Episodes: </span>
<li>${episode.length}</li>
</div>

</div>
<button type="button" class='delete-button'>Delete</button>
</article>  

</div>

  

`;

export default characterItem;
