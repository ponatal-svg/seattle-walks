import type { Walk } from '../types';

export const walk12: Walk = {
  id: 12,
  title: 'Capitol Hill',
  subtitle: 'Elegance in the Details',
  distance: '2.8 mi',
  difficulty: 'moderate',
  startPoint: '15th Ave E & E Garfield St (Louisa Boren Park)',
  endPoint: '15th Ave E & E Garfield St (Louisa Boren Park)',
  totalStops: 16,
  waypoints: [
    {
      id: 1,
      title: 'Louisa Boren Park',
      location: '15th Ave E & E Garfield St',
      coords: { lat: 47.6354, lng: -122.3115 },
      content: `With its great views out to Lake Washington, Union Bay, and the Cascade Mountains, Louisa Boren Park is a hidden little treasure on Capitol Hill. It is also home to several historic trees, English oaks that grow along the drop-off on the eastern edge of the park, across the path from Lee Kelly's large, unnamed sculpture. Seattle Parks Department historian Don Sherwood wrote that the trees were originally planted at Denny Park and were moved here in 1930 when Denny Park was lowered during the final regrade of Denny Hill. No other trees that grew at Denny before the regrade are known to exist.

This small park honors one of Seattle's earliest citizens. Born in Illinois in 1827, Louisa Boren arrived here on November 13, 1851, as part of the Denny Party, the group of settlers who are considered the founders of Seattle. She was single at the time but soon married David Denny in the first settler wedding in the city. Because she had carried sweetbriar rose seeds from her home, she was known as the Sweetbriar Bride. Louisa's other claim to fame is that she was the last survivor of the Denny Party (she died in August 1916).`,
    },
    {
      id: 2,
      title: 'Grand Army of the Republic Cemetery',
      location: 'E Howe St, between Federal Ave E & 11th Ave E',
      coords: { lat: 47.6364, lng: -122.3168 },
      content: `The Grand Army of the Republic (GAR) was a fraternal organization set up to aid Union veterans of the Civil War. In 1896, five local GAR posts united to acquire land from Huldah and David Kaufman and establish a cemetery for the veterans and their wives. There are 526 graves—mostly of Union soldiers including three Black soldiers (which was unusual for its era); GAR accepted any soldier's remains as long as they were of a Civil War veteran. A couple of Confederate veterans are also buried here. The vast majority of the interred soldiers died in or near Seattle. The Seattle Parks Department now manages the cemetery with the help of a neighborhood group. To get a feel for the layout of the tombstones, walk to the obelisk, which was placed by the Woman's Relief Corps.`,
    },
    {
      id: 3,
      title: 'Office of the Bishop · Episcopal Diocese',
      location: '1551 10th Ave E',
      coords: { lat: 47.6335, lng: -122.3205 },
      content: `This grand building was originally the home of John and Eliza Leary. Leary arrived in Seattle in 1869 and soon became involved in numerous development projects including coal mines in Renton, a water supply company in Seattle, and ownership of the Seattle Post (which eventually became the Seattle Post-Intelligencer, a long-time Seattle newspaper). He was also Seattle's mayor from 1884 to 1885 as a member of the Business Men's Ticket party. He married Eliza Ferry, daughter of Washington state's first governor, Elisha Ferry, in 1891.

In 1903, Leary hired Alfred Bodley to design a house for him and his wife. Unfortunately, he died before the house was finished. Eliza, who was well known for hosting many events at the house, lived there until her death in 1935. The lovely sandstone used in the construction of the house came from Tenino, Washington, one of three areas that supplied most of the local stone used in building projects across the region. It is a 50-million-year-old sandstone, deposited when what we now think of as the I-5 corridor was oceanfront property and the Olympic Mountains did not exist.

During World War II, the American Red Cross acquired the Leary house and used it as its headquarters with training rooms, dormitories for evacuees, and a home-nursing department. After the war, the house passed to the Episcopal Diocese of Olympia. Curiously, the bishop decided to remove a couple of the house's most famous features, two glass windows (16 by 8 feet and 8 by 8 feet) designed by Louis Comfort Tiffany. The bishop donated them to the Burke Museum, noting that they made the house's great hall look too much like a funeral parlor. The Burke still owns them and has put them on display in the new museum.

Next door to the south is the former home of Eliza's brother, Pierre, which includes several carved wooden owls. Historically, this area was known as "owl hollow" because owls nested in the surrounding trees. When you pass the gates, look for the two modern sculptures of owls.

One additional detail of note: 10th Avenue curves slightly around the former Leary property. Historically, 10th did not go north past this point and instead ended at a cul-de-sac that led into Leary's driveway. The modern road is not straight because Leary and other nearby land owners didn't want the road to cross their land. An article in the Seattle Daily Bulletin reported that Leary's group eventually sided with city engineers but on the condition that "unsightly poles, billboards, and other nuisances and street cars are to be kept off" the new road.`,
    },
    {
      id: 4,
      title: 'Sam Hill Mansion',
      location: '814 E Highland Drive',
      coords: { lat: 47.6307, lng: -122.3215 },
      content: `Samuel Hill was a lawyer and railroad executive who worked primarily for and with his father-in-law, James J. Hill (the "empire builder" mentioned in Walk 7). The younger Hill moved to Seattle in 1901 and soon became involved in a variety of investments. He is probably best known for building his Maryhill Mansion and Stonehenge Memorial (in southern Washington on the Columbia River, 10 miles south of Goldendale). Hill began work on his Capitol Hill home in 1908. According to a Seattle Times article, he built it in part to host Crown Prince Albert Leopold of Belgium, whom Hill had invited to Seattle for the Alaska-Yukon-Pacific Exposition. Unfortunately for Hill, politics kept Leopold from visiting Seattle.

Made of concrete, the walls are 10 feet thick at the base and reinforced with massive steel rails. On top of the house was a rooftop garden where guests could eat dinner in a park-like setting. Other novel features included a telephone in each room, a gas-powered heating plant, and a single switch in the primary bedroom that could turn on all the lights in the house. Note the small sundial on the southeastern corner of the house (above a gate). The quote on the dial is from Rowland Hazard, a woolen manufacturer and friend of Hill's from Rhode Island, who had a sundial on his house.`,
    },
    {
      id: 5,
      title: 'Horace Chapin Henry Estate',
      location: 'Harvard Ave E & E Prospect St (NW corner)',
      coords: { lat: 47.6310, lng: -122.3223 },
      content: `Horace Chapin Henry, a wealthy railroad builder, originally owned the 1.6-acre hedge-lined property that encompasses the northwest corner of the intersection. The estate included a large mansion, stables, and private art gallery, all of which were demolished and eventually replaced in the 1950s with a more modern house. The Henry Gallery on the University of Washington campus started with Henry's donation of his art collection. After his death, Henry's sons donated the house and property to the city for a library on Capitol Hill in honor of their mother, Susan J. Henry. The library board had neither the money to renovate the mansion for a library nor to pay the 90 dollars a month necessary for upkeep of the grounds. In 1953, the board sold the property to pay for the site of the present Capitol Hill Branch of the library, which was initially known as the Susan J. Henry Branch. Seattle Parks and Recreation acquired the land and property in 2021 when long-time owner Kay Bullitt died. Seattle Parks has plans to develop it into a public space, though the house will not be open to the public.`,
    },
    {
      id: 6,
      title: 'Harvard-Belmont Historic District',
      location: 'E Prospect St & Boylston Ave E',
      coords: { lat: 47.6309, lng: -122.3242 },
      content: `You are now in the heart of the federally and city designated Harvard-Belmont Historic District, an area bounded roughly by E Highland Drive, Belmont Avenue E, E Roy Street, and Broadway E. Starting in the 1890s, the area became a premier location for wealthy Seattleites to build large homes, often in an English country-manor style. Architectural historian Larry Kreisman says the Old World–style was popular for "substantial, sophisticated homes of the well-to-do, [which gave] the nouveau riche the appearance of long-held ties to the land and the city." Many of these estates covered four, six, or more lots. Although nearly all of the original families have moved away, more than 50 homes in the district have architectural and/or historical significance.`,
    },
    {
      id: 7,
      title: 'Garry Oak · Belmont Place',
      location: 'Belmont Place E & Belmont Ave E',
      coords: { lat: 47.6257, lng: -122.3241 },
      content: `To your right, on the corner where the Belmonts intersect, is a large and unusual tree. It is a Garry oak (also known as Oregon white oak), Washington's lone native oak. In 1840 the great botanist David Douglas named the species Quercus garryana after Nicholas Garry, a deputy governor for the Hudson's Bay Company. As noted in a sidebar in the Rainier Beach walk (Walk 15), Garry oaks are rare this far north and why this one exists here is unknown, though it was about half its present height in 1928 when the adjacent Oak Manor apartments were built.`,
    },
    {
      id: 8,
      title: 'Cornish College · Kerry Hall',
      location: 'Boylston Ave E & E Roy St',
      coords: { lat: 47.6253, lng: -122.3231 },
      content: `In 1914 Nellie Cornish started the Cornish College of the Arts, where she taught piano to children in a single room. When she outgrew that space (at the corner of Broadway and Pine Street), she moved her school to this location in 1921, where she had the present building designed to her specifications. The new school building's appearance was described in the Town Crier as having "both the restraint and freedom of [the] Venetian, the Spanish, the Levant, and even of Tibet." At the top of the building are names of famous artists: Anna Pavlova, Russian ballerina; John Millington Synge, Irish playwright and poet; Wilhelm Richard Wagner, German composer; William Morris, British designer; and James Abbott McNeill Whistler, American painter. Miss Aunt Nellie, as she was known to people at the school, hoped such luminaries would inspire her students. The bas-relief panels near the building's cornice were modeled on students at the school. Today this building, known as Kerry Hall, houses the Cornish College dance and music department, and the school's main campus is near Westlake Avenue and Denny Way.`,
    },
    {
      id: 9,
      title: 'DAR House & Woman\'s Century Club',
      location: 'Harvard Ave E & E Roy St',
      coords: { lat: 47.6257, lng: -122.3208 },
      content: `Seattle's DAR chapter was founded in 1895 and met in members' homes until its membership grew too large. Eliza Ferry Leary guided the development and building of the new bigger space, which was built in 1925 and is a copy of George Washington's home, Mount Vernon. Across the street on the southwest corner of Roy and Harvard Avenue is a small public space consisting of benches and terra-cotta elements. On one of the benches is a large tile bearing an architectural drawing by John Graham, a well-known local architect. The tile also includes a quote from Italo Calvino.

On the southeast corner is the former home of the Woman's Century Club, founded in 1891. Started by 10 women, who "felt its need in the sordid atmosphere of a rapidly developing western city," the club's purpose was "for intellectual culture, original research and the solution of the altruistic problems of the day." By 1925, membership had reached 350 women and the club organized to build the present building. The club still meets regularly though not in this building, which housed the Harvard Exit movie theater for many decades.`,
    },
    {
      id: 10,
      title: 'Loveless Building',
      location: 'E Roy St near Broadway E',
      coords: { lat: 47.6257, lng: -122.3195 },
      content: `The handsome two-story building on your left is named for its architect Arthur Loveless, who built it in 1931. Described as a "little bit of England" in Seattle, the building centers on a private courtyard surrounded by housing and studio and sales spaces that Loveless hoped would be utilized by local artists. Note the cinder blocks, which were used because they were less expensive than cut stone.`,
    },
    {
      id: 11,
      title: 'Anhalt Apartments',
      location: 'E Roy St, between Broadway E & 13th Ave E',
      coords: { lat: 47.6257, lng: -122.3185 },
      content: `Frederick Anhalt is responsible for the apartments on either side of Roy. In the late 1920s, he developed, designed, and built bungalows, commercial buildings, and apartments across Seattle. Anhalt is probably best known for his elegant Capitol Hill apartments with their French Norman–inspired elements, such as turrets, arches, and exposed exterior beams, and house-like feel created by the addition of a fireplace, usually front and back doors, and often a courtyard garden.`,
    },
    {
      id: 12,
      title: 'Millionaire\'s Row · Hitching Post',
      location: '14th Ave E & E Roy St',
      coords: { lat: 47.6257, lng: -122.3148 },
      content: `You are about to enter what has long been known as "Millionaire's Row," where you will find some of Seattle's finest early 20th-century homes. Built of wood, granite, sandstone, and brick, they display a wide range of styles, though all carry an air of distinction. On the west side of the intersection is a rare sign of early Seattle—a granite hitching post complete with steel ring. During the late 1800s and into the early 1900s, when horses were the main means of travel around the city, hitching posts, such as this one and several up the block, would have been common and needed.

According to historian Fred Brown, people put up posts because the city had laws against animals running at large, and if an animal strayed, city-hired herders would round up loose livestock, mostly horses and cows, and take them to the cattle pound. In addition, to address concerns about startled horses injuring pedestrians or themselves, the Humane Society pushed for laws that required teamsters to carry weights that they could attach to horses to keep them from running wild. The other option was to tie the horses to hitching posts.

One block north on the east side of 14th is another remnant of the city's early equestrian history. On the southeast corner of E Valley Street close to the road is a low granite block, or stepping stone. People getting out of horse-drawn carriages would have stepped onto the block and then down to the ground. This block was owned by Elbridge Amos Stuart, who started the Carnation Evaporated Milk Company. He also owned the house behind the stepping stone.`,
    },
    {
      id: 13,
      title: 'James A. Moore Mansion',
      location: '14th Ave E & E Aloha St (SW corner)',
      coords: { lat: 47.6268, lng: -122.3148 },
      content: `The brick mansion (built in 1903) on the southwest corner was the home of Capitol Hill's developer James A. Moore. He also built the Moore Theater in downtown and had a role in regrading the south side of Denny Hill, where he owned the legendary Washington Hotel.`,
    },
    {
      id: 14,
      title: 'Volunteer Park',
      location: '1247 15th Ave E',
      coords: { lat: 47.6290, lng: -122.3146 },
      content: `Like many who achieve success late in life, Volunteer Park began rather humbly as 40 acres purchased by the city for a cemetery in 1876. It was named Washelli, a Makah word meaning "west wind." In 1887, the City Council decided that the land would better serve as space for the living. It had all the graves removed and the former cemetery was renamed Lake View Park. That name didn't last either; it became City Park and finally Volunteer, in 1901, the same year the reservoir was built.

Eight years later, park designer John Charles Olmsted wrote that as Volunteer "will be surrounded by a highly finished style of city development, it will be best to adopt a neat and smooth style of gardening throughout." The implementation of Olmsted's plans finally led to the park becoming one of the city's most popular public spaces.

In front of you is the brick water tower (built in 1906), or stand pipe, whose internal tank holds 883,000 gallons. Inside the tower, winding around the tank, are 106 steps up to an observation area with views of the city—best in winter when leaves don't block the scenery—and an excellent display about the city's park system (open to the public). As with the other stand pipes around Seattle (for example, on Queen Anne Hill and in West Seattle and Magnolia), it was built on a high point, a necessity because gravity is the main force feeding water from the city's reservoirs into surrounding homes.`,
    },
    {
      id: 15,
      title: 'Seattle Asian Art Museum',
      location: 'Volunteer Park, 1400 E Prospect St',
      coords: { lat: 47.6303, lng: -122.3141 },
      content: `On the right is the original Seattle Art Museum, which opened in 1933 with money provided by Margaret MacTavish Fuller and her son Richard, who directed the museum for 40 years. It now houses the Seattle Asian Art Museum. Architectural historians consider it a very progressive design for its time because it broke away from the traditional neoclassical style that then prevailed in the design of most American museums. The building's sandstone came from the Wilkeson quarry near Mount Rainier. It is another of the three principal suppliers of sandstone in western Washington. Chuckanut, near Bellingham, is the third.

North of the museum is the Volunteer Park Conservatory, which opened in 1912. The city purchased it as a kit from Hitchings & Company in New York and assembled the metal frame with its 3,426 glass panes on site. The design is based on London's Crystal Palace. Housed in the conservatory is an enticing collection of cacti, orchids, bromeliads, and palms that is ever-changing and always delightful. In recent years, restoration has focused on returning the building to its historic appearance.`,
    },
    {
      id: 16,
      title: 'Streetcar Slabs · Lake View Cemetery',
      location: '15th Ave E, north of Volunteer Park exit',
      coords: { lat: 47.6321, lng: -122.3157 },
      content: `Note the concrete blocks of the retaining wall. Each block has one or two holes. In the former streetcar system that ran down 15th, the trolley's steel rails sat atop and were attached to the slabs. The Capitol Hill line opened in November 1901. As was true of other early Seattle trolley routes, a big impetus for this route's construction was to promote the sale of adjacent real estate. Within a few years, other lines opened on the hill. Not coincidentally, most of the modern bus routes that traverse Capitol Hill, including those that run along Summit, Broadway, 15th, 19th, and 24th, follow the historic trolley routes. By 1941, all of the streetcars on Capitol Hill and throughout the city had been replaced by buses.

Lake View Cemetery across the street to the west is one of the oldest in the city and one of the most diverse with its graves of city settlers such as Arthur Denny, Henry Yesler, and Doc Maynard; Chief Seattle's daughter Kikisebloo (aka Princess Angeline); Bruce Lee and his son Brandon; a horse named Buck; and Madam Damnable, who ran an early brothel and earned her name for her proclivity for profanity.`,
    },
  ],
};
