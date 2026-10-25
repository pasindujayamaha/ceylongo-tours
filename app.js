const form=document.querySelector('#booking-form'),result=document.querySelector('#result');
const today=new Date(Date.now()+19800000).toISOString().slice(0,10);for(const el of form.querySelectorAll('[type=date]'))el.min=today;
function serviceChanged(){
 const scooter=form.service.value==='scooter',airport=form.service.value==='airport';
 form.passengers.value=scooter?1:Math.max(1,+form.passengers.value);form.passengers.max=scooter?1:30;
 document.querySelector('#start-label').textContent=scooter?'Pickup date':airport?'Pickup / drop-off date':'Start date';
 document.querySelector('#end-label').textContent=scooter?'Drop-off date':'End / return date';
 form.end.closest('label').hidden=airport;form.end.required=!airport;form.end.disabled=airport;
 for(const field of [form.flight,form.time]){field.closest('label').hidden=!airport;field.required=airport;field.disabled=!airport;if(!airport)field.value='';}
 form.nameboard.closest('label').hidden=!airport;form.nameboard.disabled=!airport;if(!airport)form.nameboard.checked=false;
 form.journey.closest('label').hidden=scooter||airport;form.journey.disabled=scooter||airport;
 form.pricing.closest('label').hidden=scooter;form.pricing.disabled=scooter;
 document.querySelector('#airport-direction').hidden=!airport;form.direction.disabled=!airport;
}
serviceChanged();
form.start.addEventListener('change',()=>{form.end.min=form.start.value||today;});
form.addEventListener('reset',()=>setTimeout(()=>{serviceChanged();form.end.min=today;},0));
form.contact.removeAttribute('pattern');
form.contact.addEventListener('input',()=>{const phone=form.contact.value.replace(/[\s().-]/g,'');form.contact.setCustomValidity(phone&&!/^\+[1-9]\d{7,14}$/.test(phone)?'Enter a WhatsApp number with country code, starting with +.':'');});
form.service.addEventListener('change',serviceChanged);
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{form.service.value=a.dataset.service;serviceChanged();}));
async function submit(check){if(!form.reportValidity())return;
 if(document.body.dataset.pagesPreview==='true'){
  if(check){result.textContent='Please contact us on WhatsApp to confirm availability.';return;}
  if(form.service.value!=='airport'&&form.end.value<form.start.value){result.textContent='Drop-off / end date must be on or after your start date.';return;}
  const fields=[...new FormData(form)].filter(([key])=>key!=='nameboard').map(([key,value])=>`${key}: ${value}`);
  const text='Hi CeylonGo Tours! Please check this trip inquiry.\n\n'+fields.join('\n')+(form.nameboard.checked?'\nName board requested':'');
  window.open('https://wa.me/94767769759?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');result.textContent='Your WhatsApp draft has opened. Send it there to contact our team. This is not a confirmed reservation.';return;
 }
 const buttons=form.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);result.textContent=check?'Checking your dates…':'Sending your request…';try{const payload=Object.fromEntries(new FormData(form));const r=await fetch(check?'/api/availability':'/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw Error(data.error);result.className='';result.textContent=check?(data.requestOnly?'Your itinerary will be prepared personally. Send your inquiry to start.':`${data.count} suitable vehicle(s) currently available. ${payload.service==='scooter'?`Estimated rental: USD $${data.days*10} for ${data.days} day(s). `:''}Availability is reserved only after confirmation.`):`Thank you! Request ${data.id} is pending. Our team will contact you using the details provided. No reservation or payment has been made.`;if(!check)form.reset();}catch(e){result.className='error';result.textContent=e.message;}finally{buttons.forEach(b=>b.disabled=false);}}
form.addEventListener('submit',e=>{e.preventDefault();submit(false)});document.querySelector('#check').addEventListener('click',()=>submit(true));

// Design-only sample reviews. Replace with approved customer quotations before launch.
const gallery=document.querySelector('.gallery');
if(gallery){
 gallery.tabIndex=0;gallery.setAttribute('role','region');gallery.setAttribute('aria-label','Sri Lanka trip photo slider. Swipe, drag or use arrow keys.');
 const controls=document.createElement('div');controls.className='gallery-controls';const hint=document.createElement('p');hint.textContent='Drag or swipe to explore all 12 photos';const arrows=document.createElement('div');arrows.className='gallery-arrows';
 function move(direction){const card=gallery.querySelector('figure');gallery.scrollBy({left:direction*(card.getBoundingClientRect().width+20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 for(const [label,text,direction]of [['Previous trip photos','←',-1],['Next trip photos','→',1]]){const button=document.createElement('button');button.type='button';button.textContent=text;button.setAttribute('aria-label',label);button.addEventListener('click',()=>move(direction));arrows.append(button);}
 controls.append(hint,arrows);gallery.after(controls);
 let drag=null;gallery.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:gallery.scrollLeft};gallery.setPointerCapture(e.pointerId);gallery.classList.add('is-dragging');});
 gallery.addEventListener('pointermove',e=>{if(drag){gallery.scrollLeft=drag.left-(e.clientX-drag.x);}});
 function endDrag(){drag=null;gallery.classList.remove('is-dragging');}gallery.addEventListener('pointerup',endDrag);gallery.addEventListener('pointercancel',endDrag);gallery.addEventListener('lostpointercapture',endDrag);
 gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
}

const sampleReviews=[
 ['An easy arrival, beautiful coastal stops and the freedom to explore at our own pace.','Private driver'],
 ['Stepping out of the airport and knowing our ride was arranged made the first day feel so simple.','Airport arrival'],
 ['A scooter, a quiet coastal road and a whole day with no rush. Exactly the kind of island day we imagined.','Scooter day'],
 ['We loved having time to stop for a view, a coconut and a little local advice along the way.','Southern coast'],
 ['Our first Sri Lanka route felt much easier to picture once we talked through the places we wanted to see.','Custom trip planning'],
 ['Travelling together in one vehicle gave us more time to enjoy the journey and less to organise.','Family transport'],
 ['From the coast to the green hills, the journey became part of the adventure.','Hill-country journey'],
 ['We wanted a slower pace and room for a few detours. This is how we pictured our holiday.','Flexible private trip'],
 ['A simple pickup, a comfortable journey and one less thing to think about on a travel day.','One-way transfer'],
 ['Those last ocean views on the way back were the perfect ending to our island plans.','Return journey']
];
const carousel=document.querySelector('.review-carousel');
if(carousel){let current=0,touchStart=null;const dots=document.querySelector('.review-dots');
 function showReview(index){current=(index+sampleReviews.length)%sampleReviews.length;const [quote,trip]=sampleReviews[current],number=String(current+1).padStart(2,'0');document.querySelector('#review-quote').textContent='“'+quote+'”';document.querySelector('#review-name').textContent='Sample travellers '+number;document.querySelector('#review-trip').textContent=trip+' · sample story';document.querySelector('.sample-tag').textContent='DESIGN PREVIEW · SAMPLE REVIEW '+number;document.querySelector('#review-count').textContent=number+' / 10';document.querySelector('#review-slide').setAttribute('aria-label',`${current+1} of 10`);dots.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));}
 sampleReviews.forEach((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Show sample review ${i+1}`);dot.addEventListener('click',()=>showReview(i));dots.append(dot);});
 document.querySelector('#review-prev').addEventListener('click',()=>showReview(current-1));document.querySelector('#review-next').addEventListener('click',()=>showReview(current+1));
 carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showReview(current+(e.key==='ArrowRight'?1:-1));}});
 carousel.addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});carousel.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))showReview(current+(dx<0?1:-1));touchStart=null;},{passive:true});showReview(0);
}
