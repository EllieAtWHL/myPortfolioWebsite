import { createLink } from "/scripts/CustomElements.js";

const BLOGPOST_MAP = [
    {title: 'It Begins...', url: 'it-begins.html'},
    {title: 'An Invitation', url: 'an-invitation-to-audition.html'},
    {title: 'My First Audition', url: 'my-first-audition.html'},
  ]

  /*
  {title: 'Drumming?!?', url: 'drumming-audition.html'},
  {title: 'The Decision Arrives', url: 'the-decision-arrives.html'},
  {title: 'My First Rehearsal', url: 'my-first-rehearsal.html'},
  {title: '1,000 Drummers', url: '1000-drummers.html'},
  {title: 'Costume Fittings & Goodbye to 3 Mills', url: 'costume-fitting.html'},
  {title: '#', url: 'Organised Chaos'},
  {title: '#', url: 'The Olympic Stadium!'},
  {title: '#', url: 'Games-Time Accreditation'},
  {title: '#', url: 'Top of the Tor'},
  {title: '#', url: 'Diva Moment'},
  {title: '#', url: 'A Good Soaking'},
  {title: '#', url: 'Transitions'},
  {title: '#', url: 'The Final Rehearsals'},
  {title: '#', url: 'We Have an Audience'},
  {title: '#', url: 'The Opening Ceremony'},
  {title: '#', url: 'Star-Studded Rehearsals'},
  {title: '#', url: 'The Closing Ceremony'},
  {title: '#', url: 'Final Thoughts'}
]

*/

class BlogSidebar extends HTMLElement{
    constructor(){
      super();
  
      const { pathname } = window.location;
      const currentPost = pathname.substring(pathname.lastIndexOf('/') + 1);
  
      const mode = this.getAttribute('mode');

      const wrapper = document.createElement('div');
      
      if(mode === 'large') wrapper.classList.add('centre');
      const titleSize = mode === 'large' ? 'h1' : 'h3';

      const title = document.createElement(titleSize);
      title.innerText = 'My Olympic Journey';
      const subtitle = document.createElement('h4');
      subtitle.innerText= 'Posts' ;
      
      const listWrapper = document.createElement('ul');
      BLOGPOST_MAP.forEach(post => {
        const listItem = document.createElement('li');
        if(post.url === currentPost){
          listItem.innerText = post.title;
        } else {
          listItem.appendChild(createLink({href: `./${post.url}`, text: post.title}))
        }
        listWrapper.appendChild(listItem);
      })
  
      const comingSoon = document.createElement('li');
      comingSoon.innerText = 'More coming soon...'
      listWrapper.appendChild(comingSoon);
      
      wrapper.appendChild(title);
      wrapper.appendChild(subtitle);
      wrapper.appendChild(listWrapper);
  
      this.append(wrapper);
    }
  }
 
customElements.define('ellieatwhl-blogsidebar', BlogSidebar);