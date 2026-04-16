import type { Walk } from '../../types';

export const walk: Walk = {
  id: 1,
  title: 'From Rebellion to Restoration',
  subtitle: '400 Years of Santa Fe History',
  distance: '2.1 mi',
  difficulty: 'moderate',
  startPoint: 'New Mexico Capitol',
  endPoint: 'Fort Marcy Park',
  totalStops: 13,

  mapUrls: [
    'https://www.google.com/maps/dir/35.6828,-105.9402/35.6853,-105.9376/35.6874,-105.9378/35.6880,-105.9372/35.6884,-105.9369/35.6889,-105.9376/35.6885,-105.9390/35.6885,-105.9397/35.6888,-105.9397/35.6881,-105.9415/',
    'https://www.google.com/maps/dir/35.6895,-105.9392/35.6905,-105.9395/35.6920,-105.9380/35.6925,-105.9370/35.6930,-105.9355/35.6932,-105.9350/35.6920,-105.9345/35.6915,-105.9340/35.6918,-105.9335/35.6910,-105.9330/',
  ],

  introduction: `This 2.1-mile loop offers a comprehensive journey through Santa Fe's 400-year evolution, from its indigenous Puebloan roots to Spanish colonization and American expansion. As we stand here at the start of our walk, we are beginning a story of survival, rebellion, and a unique cultural blending that you won't find anywhere else in the United States.

Starting in the historic Barrio de Analco, you will witness the architectural layers of the "City Different," featuring the oldest church and house in the United States alongside 19th-century Gothic and Romanesque cathedrals. The geography itself tells a story of survival, as various groups—Native American, Spanish, and Anglo—fought for and thrived in this high-altitude desert environment.

Our walk provides a cohesive narrative of the Pueblo Revolt of 1680, guiding you through the strategic sites of the siege at the Palace of the Governors and the eventual Spanish reconquest. We will explore the profound religious and social tensions, often called "Franciscan Friction," that defined the first century of Spanish rule. You'll stand at the spot where the San Juan Pueblo leader, Po'pay, orchestrated a massive, unified uprising that completely expelled European colonizers for over a decade—the only successful indigenous revolt of its kind in North America.

We'll then shift gears to see how the city transformed during the 19th-century American era. You'll see the influence of European tastes in the Loretto Chapel and the Cathedral Basilica, and we'll visit the terminus of the 800-mile Santa Fe Trail, which turned this dusty outpost into a hub of frontier trade.

Finally, we will ascend toward the Cross of the Martyrs and the ruins of Fort Marcy, the first American military installation in the Southwest. As we reach the summit, you'll be rewarded with panoramic views of the Sangre de Cristo Mountains and a deeper understanding of how these three cultures shaped this high-desert capital into the living museum it is today.`,

  waypoints: [
    {
      id: 1,
      title: 'New Mexico Capitol Art Collection',
      location: '411 Old Santa Fe Trail',
      coords: { lat: 35.6828, lng: -105.9402 },
      image: '/santa-fe/stop-1.jpg',
      content: `Take a look at this building—we call it the "Roundhouse." Most state capitols look like miniature versions of D.C., but New Mexico decided to be different. It's the only circular capitol in the U.S., designed specifically to resemble a Zia sun symbol when viewed from above.

As we walk in, don't think of it as just a government office; it's actually a significant cultural venue housing the Capitol Art Collection, which features a vast array of works by New Mexican artists. Standing on the southern edge of the historic district, this building represents the latest chapter in Santa Fe's 400-year history as a capital city. It's a quiet, contemplative place to start, grounding us in the local art and politics that define the "City Different" today.`,
    },
    {
      id: 2,
      title: 'San Miguel Chapel',
      location: '401 Old Santa Fe Trail',
      coords: { lat: 35.6853, lng: -105.9376 },
      image: '/santa-fe/stop-2.jpg',
      content: `We're standing in front of what's widely considered the oldest church in the continental United States, originally constructed around 1610. It was built by Tlaxcalan Indians from Mexico who accompanied the Spanish settlers.

When you look at these thick adobe walls, remember they've seen the 1680 Pueblo Revolt firsthand—the chapel was partially destroyed as indigenous warriors sought to reclaim their spiritual autonomy. It was significantly rebuilt in 1710 following the Spanish reconquest. Inside, you can see the historic San Jose Bell, reportedly cast in Spain in 1356, and a beautiful wooden reredos from 1798. It remains an active place of worship and a powerful symbol of the early Spanish colonial mission system.`,
    },
    {
      id: 3,
      title: 'Loretto Chapel',
      location: '211 Old Santa Fe Trail',
      coords: { lat: 35.6874, lng: -105.9378 },
      image: '/santa-fe/stop-3.jpg',
      content: `Notice how different this looks? We've left the adobe and stepped into a Gothic Revival "mini-cathedral" completed in 1878. Commissioned by the Sisters of Loretto, its vertical style stands in stark contrast to the low-slung adobe buildings typical of Santa Fe.

The chapel is world-famous for its "Miraculous Staircase," featuring two 360-degree turns without any visible central support or nails. According to local lore, a mysterious carpenter built it with only basic tools after the sisters finished a nine-day prayer to St. Joseph. While the staircase originally lacked railings, they were added later for safety. Today, it serves as a museum illustrating the influence of European architectural tastes during the 19th-century American era.`,
    },
    {
      id: 4,
      title: 'Franciscan Friction',
      location: 'Near Cathedral Basilica',
      coords: { lat: 35.6880, lng: -105.9372 },
      image: '/santa-fe/stop-4.jpg',
      content: `As we head toward the main Cathedral, let's talk about the profound religious and social tensions—often called "Franciscan Friction"—that defined the first century of Spanish rule.

Beginning in the early 1600s, Franciscan missionaries worked to convert the Puebloan people, often using coercive methods and banning traditional ceremonies. This period saw the destruction of indigenous "kivas" (sacred chambers) and the forced labor of local tribes. The suppression of Puebloan spiritual life created deep-seated resentment that eventually culminated in the 1680 Pueblo Revolt. Understanding this friction gives you insight into why the uprising was so coordinated and decisive. It's a dark chapter where the push for religious uniformity clashed violently with ancient traditions.`,
    },
    {
      id: 5,
      title: 'Cathedral Basilica of St. Francis of Assisi',
      location: '131 Cathedral Pl',
      coords: { lat: 35.6884, lng: -105.9369 },
      image: '/santa-fe/stop-5.jpg',
      content: `This Romanesque Revival cathedral was built by Archbishop Jean Baptiste Lamy between 1869 and 1886 to bring a more European sensibility to the New Mexico territory. It stands on the site of earlier churches destroyed during the 1680 Pueblo Revolt.

The north chapel houses La Conquistadora, a wood-carved statue of the Madonna brought here in 1625, making it the oldest such statue in the U.S. Interestingly, the cathedral has a historical connection to the city's darker past, having been the site of several 18th-century witchcraft trials during the Spanish colonial period. Its bronze doors and French stained glass reflect the Archbishop's desire to modernize the local church, yet it remains deeply rooted in centuries of Catholic faith in the high desert.`,
    },
    {
      id: 6,
      title: "Po'pay's Revenge & Santa Fe Trail Marker",
      location: '100 Old Santa Fe Trail',
      coords: { lat: 35.6885, lng: -105.9390 },
      image: '/santa-fe/stop-6.jpg',
      content: `We're standing at a geographical intersection for two of Santa Fe's most pivotal stories. This corner features the official marker for the terminus of the Santa Fe Trail, the 800-mile commercial route connecting Missouri to New Mexico in the 19th century.

However, long before the wagons arrived, this spot was the epicenter of "Po'pay's Revenge." In August 1680, San Juan Pueblo leader Po'pay orchestrated a massive, unified uprising. Warriors surrounded the Spanish settlers gathered at the Plaza, famously cutting off the water supply and forcing them to flee south toward El Paso. This event was the only successful indigenous revolt to completely expel European colonizers from a major North American settlement for over a decade.`,
    },
    {
      id: 7,
      title: 'Santa Fe Plaza & Palace of the Governors',
      location: '105 W Palace Ave',
      coords: { lat: 35.6888, lng: -105.9397 },
      image: '/santa-fe/stop-7.jpg',
      content: `The Santa Fe Plaza has been the heart of the city since 1610, functioning as the center of military, religious, and social life. Facing us is the Palace of the Governors, the oldest continuously occupied public building in the United States.

During the 1680 Pueblo Revolt, this building became a fortress for nearly 1,000 settlers. Pueblo warriors besieged the Palace and cut off the "acequia" (irrigation ditch) that provided its water, forcing a Spanish surrender. After the Spanish reconquest in 1692, it returned to its role as the seat of government under Spain, Mexico, and later the U.S. Today, the shaded portal is home to the Native American Vendors Program, where artisans continue a centuries-old tradition of selling handmade pottery and jewelry.`,
    },
    {
      id: 8,
      title: "Chocolate + Cashmere's Secret History",
      location: '130 Lincoln Ave',
      coords: { lat: 35.6895, lng: -105.9392 },
      image: '/santa-fe/stop-8.jpg',
      content: `While many stops focus on battles, this spot represents Santa Fe's evolution into a modern center for luxury and art. The building sits in a historic district that was once the hub of frontier trade.

It contains a "secret history" regarding the commercial transition of the city after the railroad arrived in 1880. As Santa Fe shifted from a gritty territorial outpost to a curated destination for travelers, buildings like this were repurposed to maintain their adobe charm while housing high-end boutiques. This stop illustrates the city's ability to thrive in a global economy while preserving its character—reflecting a blend of Old World aesthetics and modern refinement often noted in Southwestern architecture.`,
    },
    {
      id: 9,
      title: "Po'pay's Story Ends & Otermín Tries Again",
      location: 'North of Plaza',
      coords: { lat: 35.6905, lng: -105.9395 },
      image: '/santa-fe/stop-9.jpg',
      content: `After the Spanish were expelled in 1680, the Pueblo people moved into the Spanish buildings and lived independently in Santa Fe for twelve years. They sought to erase Spanish influence, returning to their traditional ways of life and reclaiming their land.

During this interregnum, Spanish Governor Antonio de Otermín attempted a reconquest in 1681, but he found the Puebloan defenses too strong and was forced back to El Paso. This period of indigenous sovereignty is a rare chapter in North American history, showing a successful reclamation of culture. However, unity among the Pueblos eventually began to fracture due to internal politics and drought, creating the vulnerabilities that allowed for the eventual Spanish return to the valley.`,
    },
    {
      id: 10,
      title: 'Diego de Vargas',
      location: 'Near Paseo de Peralta',
      coords: { lat: 35.6920, lng: -105.9380 },
      image: '/santa-fe/stop-10.jpg',
      content: `In 1692, Don Diego de Vargas led the Spanish return to Santa Fe. While he famously declared a "bloodless reconquest" by offering clemency in the Plaza, the peace was short-lived.

By 1693, many Pueblo groups resisted his resettlement, leading to a violent battle for the city that ended with the execution of 70 Pueblo warriors and the enslavement of hundreds of others. De Vargas remains a deeply polarizing figure; he is celebrated by some for restoring the Catholic Church and Spanish civilization, yet viewed by others as a symbol of colonial brutality. His actions solidified Spanish control over New Mexico for the next 130 years, ensuring Santa Fe would remain a Hispanic stronghold until the American era began in the mid-19th century.`,
    },
    {
      id: 11,
      title: 'Historic Fort Marcy',
      location: 'Kearney Ave',
      coords: { lat: 35.6930, lng: -105.9355 },
      image: '/santa-fe/stop-11.jpg',
      content: `Built in 1846 by the U.S. Army during the Mexican-American War, Fort Marcy was the first American military installation in the newly acquired Southwest territory. Perched on this high hill, its massive star-shaped earthworks were intended as a psychological and physical show of force.

The fort's 27-foot-thick walls and 18-foot-deep ditches were designed to prevent any local rebellion against the new American government. While it never saw actual combat, its presence was crucial in stabilizing American rule during the transition from Mexican territory to U.S. statehood. Today, only ruins of the earthworks remain, but they provide a stark architectural contrast to the adobe buildings below, marking the moment Santa Fe was integrated into westward expansion.`,
    },
    {
      id: 12,
      title: 'Cross of the Martyrs',
      location: '617 Paseo De Peralta',
      coords: { lat: 35.6915, lng: -105.9340 },
      image: '/santa-fe/stop-12.jpg',
      content: `This towering white monument is dedicated to the 21 Franciscan friars and numerous Spanish colonists killed during the 1680 Pueblo Revolt. To reach it, we walk up a winding brick path lined with informative plaques that detail the city's history, from its 1610 founding to the reconquest.

The monument was erected as part of a 20th-century effort to commemorate the religious and cultural sacrifices made by early Spanish settlers. While it honors those lost on the Spanish side, the surrounding plaques also provide context regarding the indigenous perspective and the underlying reasons for the uprising. This site is one of the city's most significant commemorative locations, blending history with a somber atmosphere reflecting the high cost of cultural conflict.`,
    },
    {
      id: 13,
      title: 'Walk End & Viewpoint',
      location: 'Top of Fort Marcy Park',
      coords: { lat: 35.6918, lng: -105.9335 },
      image: '/santa-fe/stop-13.jpg',
      content: `Our tour concludes here at the highest point of Fort Marcy Park, offering a spectacular panoramic view of Santa Fe and the Sangre de Cristo Mountains. From this vantage point, the city's layout becomes clear, showing the central Plaza and the sprawling adobe neighborhoods following the path of the river.

It's a final opportunity to reflect on the "Three Cultures" theme: the Native American Puebloan foundations, the Spanish colonial influence, and the Anglo-American expansion. The geography tells a story of survival, as various groups fought for and thrived in this high-altitude desert environment. Looking out, you see a living museum that has maintained its 400-year-old character while evolving into a world-class center for art and culture.`,
    },
  ],
};
