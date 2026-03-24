import type { Walk } from '../types';

export const walk10: Walk = {
  id: 10,
  title: 'Union Bay → Green Lake',
  subtitle: 'Tracing a Historic Creek',
  distance: '4.7 mi',
  difficulty: 'strenuous',
  startPoint: 'E Stevens Way NE, UW Campus (Metro Route 45)',
  endPoint: 'East side of Green Lake, near community center/Evans Pool',
  totalStops: 15,
  reversed: true,
  waypoints: [
    {
      id: 1,
      title: 'Walk Start · Metro 45',
      location: 'E Stevens Way NE, UW Campus',
      coords: { lat: 47.6543, lng: -122.3062 },
      content: `Begin your walk at the Metro Route 45 bus stop on E Stevens Way NE on the University of Washington campus. When you reach Green Lake at the end of the walk, take Metro Bus route 45 west from this same stop to return.

From the bus stop, follow the road slightly downhill (about 175 yards) to the Burke-Gilman Trail. Turn right (east) and follow the trail about half a mile until you reach two sets of stairs on your left. Take the pedestrian overpass over Montlake Boulevard NE (look for the two sets of stairs that lead to the overpass). On the far side, continue east through a parking lot (be careful—watch for traffic) to a paved walkway heading east between the UW outdoor track and the UW soccer field. Follow the walkway east to a bridge that spans a narrow waterway. Cross the bridge, then bear right and follow the main path—labeled Wahkiakum Lane on the UBNA map—into Union Bay Natural Area toward the lake.`,
    },
    {
      id: 2,
      title: 'Loop Trail Viewpoint',
      location: 'Union Bay Natural Area — lake shoreline',
      coords: { lat: 47.6513, lng: -122.2835 },
      content: `Follow the main path into UBNA, and take the second left, designated as the Loop Trail on the UBNA's map on the kiosk, and follow it around the shoreline. This route offers fine birding and great views out over the lake and, if it's clear, down to Mount Rainier. Stop when you find a nice place to look out over the lake. Wherever you stop would have been underwater prior to 1916.`,
    },
    {
      id: 3,
      title: 'Wahkiakum Lane Kiosk',
      location: 'Union Bay Natural Area — Montlake Fill',
      coords: { lat: 47.6528, lng: -122.2805 },
      content: `Before 1916, Union Bay was open water that extended north to NE 45th Street and from the base of Laurelhurst across to modern-day Montlake Boulevard. With the post-canal lower lake level, the bay became a cattail marsh. In 1926 the city began dumping trash in the marsh's northeast corner. The marsh eventually became one of Seattle's primary dumps, where up to 110 truckloads of garbage arrived every day. Crews burned the industrial and household materials in open fires, but after complaints from neighbors, they began covering the trash with soil in the 1950s. By 1966, when the dump closed, 200 acres of marsh had been filled with trash and dirt, all of which now lies under parking lots, a driving range, storage yards, playfields, CUH, and UBNA.

Large-scale organized restoration of UBNA didn't start until 1990. By this time, invasive plants such as Scot's broom, purple loosestrife, and Himalayan blackberry covered the former dump, although native red alder and black cottonwood had colonized wetter areas. Crews began by removing purple loosestrife, followed by blackberry. These removal efforts continue to the present. The University of Washington Botanical Gardens manages the site and has completed more than 40 restoration projects focused on removing invasives, adding native plants, and increasing biodiversity and habitat diversity.

To provide access to visitors, researchers, and students, a little more than a mile of hard-packed trail winds through the restored landscape. Please note that in the rainy season, the trail can be very muddy and even partially submerged. Birders have reported seeing more than 250 bird species, including Cooper's hawks, ruddy ducks, barn owls, pileated woodpeckers, song sparrows, and buffleheads. Other inhabitants include coyotes, salamanders, dragonflies, butterflies, and turtles.

Like so many other creeks in Seattle, Ravenna and its outlet are not as diverse as they once were. But the many restoration projects have given these places a new life and new lives. They are ecosystems where visitors have the magical opportunity to encounter the natural world: the beauty of bigleaf maples erupting with golden fall foliage, the stoop of a hungry bald eagle over an unsuspecting duck, the slow deliquescing of mushrooms, or the first rays of the sun on a dewy patch of sedges. As can be seen at UBNA and along Ravenna Creek, restoration is not simply about habitat: it's also about creating opportunity for plants and animals (including humans).`,
    },
    {
      id: 4,
      title: 'Center for Urban Horticulture',
      location: '3501 NE 41st Street',
      coords: { lat: 47.6543, lng: -122.2789 },
      content: `Established in 1984, the Center for Urban Horticulture (CUH) is part of the University of Washington Arboretum. The center includes a library, demonstration gardens, classrooms, research facilities, and the Union Bay Natural Area (UBNA; open daily). The Natural Area, about 74 acres of wetland, pond, and shoreline, is unofficially known as the Montlake Fill.

From CUH, follow the paved path north to reach the Burke-Gilman Trail. Turn left (west) to continue toward University Village and Yesler.`,
    },
    {
      id: 5,
      title: 'Town of Yesler',
      location: '36th Ave NE at NE 43rd St',
      coords: { lat: 47.6565, lng: -122.2795 },
      content: `You are now in the heart of Yesler. If you had been walking down this road in the 1890s, you would have been on Thornell Street, named for William Thornell, former general manager of the SLS&E and the man who helped bring Seattle's first professional baseball team to town. In 1888, Henry Yesler platted his eponymous town on 23 acres of land he had purchased from Joe Surber. Surber had homesteaded 165 acres in 1872, mostly east of here, and is infamous for killing what some claim was the last cougar in Seattle in 1895. Yesler is best known for the first sawmill on Elliott Bay, which became Seattle's first important business in 1852.

As Seattle grew and logging spread farther from the original town center, Henry Yesler decided to build a new mill on the shore of Lake Washington to more easily exploit forests around the lake. The town of Yesler, which housed sawmill employees, had a one-room schoolhouse, two churches, and a post office. (The postmaster trained his dog to run to the railroad tracks and fetch mail tossed from the SLS&E train.) The mill eventually employed 36 men, who could cut up to 75,000 board feet of lumber every 12 hours. The City of Seattle annexed Yesler in 1907. None of the town of Yesler's nonresidential buildings remain.`,
    },
    {
      id: 6,
      title: 'University Village Bog',
      location: 'Burke-Gilman Trail at 30th Ave NE',
      coords: { lat: 47.6615, lng: -122.2829 },
      content: `Historically, a spur line of the SLS&E veered off the main route at this point to the small town of Yesler. The railroad made this large curve around what is now University Village Shopping Center because, prior to 1916, the lowland was a sphagnum bog. Like most local bogs, the Ravenna bog was a complex landscape of open water, floating mats of decomposing plants, and an overstory of shrubs. After the construction of the Lake Washington Ship Canal and the lowering of Lake Washington by nine feet, the bog began to dry out. University Village opened on the former bog in 1954.`,
    },
    {
      id: 7,
      title: 'Burke-Gilman Trail',
      location: 'NE Blakeley St at 25th Ave NE',
      coords: { lat: 47.6645, lng: -122.2878 },
      content: `On April 15, 1885, Thomas Burke and Daniel Gilman led a group of Seattle investors in forming the Seattle Lake Shore and Eastern (SLS&E) Railway Company, with plans to cross the Cascade Mountains to eastern Washington. Heading north out of downtown, the tracks went through Smith Cove (present-day Interbay), past Salmon Bay, and around the north ends of Lake Union and Lake Washington. Burke and Gilman chose this route for several reasons: the route south out of Seattle was taken by another railroad company, and the two hoped to connect their route to a spur of the transcontinental rail.

Workers laid the SLS&E tracks in nine months to the town of Yesler, about a half mile farther east from where you stand. The roundtrip from downtown to Yesler took 90 minutes. The tracks eventually extended to present-day Bothell and farther. Trains used the tracks on a regular basis until 1963. In 1971, Burlington Northern (a later manifestation of the Northern Pacific Railroad, which had acquired the SLS&E in 1901) abandoned the line. Pushed by citizen activists, the city acquired the rights to the train tracks and opened the first section of the Burke-Gilman Trail in 1974. Four years later the full route from Kenmore to Gas Works Park was completed.`,
    },
    {
      id: 8,
      title: 'Ravenna Creek Restoration',
      location: 'Lower Ravenna Park — near ball field drain',
      coords: { lat: 47.6673, lng: -122.2910 },
      content: `More enlightened stewardship has dominated Ravenna Park in the past few decades, particularly along the bottomland of the ravine where University of Washington students, private citizens, and groups such as EarthCorps have restored habitat. This has included removing invasive plant species (which is an ongoing endeavor), planting native ones, and mulching. Small flags often indicate ongoing restoration sites. Do not disturb them.

Arguably the most dramatic restoration occurred along the lower reach of the creek. More than a decade of debate and planning between the city, county, and citizen groups such as the Ravenna Creek Alliance led in 2006 to daylighting Ravenna Creek and restoring it to more than 650 feet of its historic route through Ravenna Park. No longer would the creek drop into a sewer pipe and disappear underground. Now it flows aboveground, providing habitat for a wealth of plants and animals. The restored creek starts approximately where you stand.`,
    },
    {
      id: 9,
      title: "Beck's Sulfur Spring",
      location: 'Ravenna Park — wood bridge, cistern & flagstones',
      coords: { lat: 47.6685, lng: -122.2928 },
      content: `In 1888, Reverend William W. and Louise Beck began to purchase land near Union Bay, including the property that the previous owners George and Oltilde Dorffel had named Ravenna Spring Park after Ravenna, Italy. (The great Romantic poet Lord Byron wrote of "Ravenna's immemorial wood.") On part of their new land, the Becks established the town of Ravenna, which later had a post office, grist mill, and Seattle Female College. The City of Seattle annexed Ravenna in 1907.

The Becks fenced off part of the ravine and charged visitors 25 cents to enter. Attractions included a sulfur spring cleverly named the "Wood Nymphs Well"; "Ye Merrie Makers' Inn," a 40-by-90-foot pavilion; and several picnic shelters and wading ponds. The small concrete cistern-like structure surrounded by flagstones near the creek is the location of the sulfur spring. A public works project during the Depression sealed off the spring because of concern that it was a public health hazard.

But the biggest attractions, literally and figuratively, were the towering Douglas firs, or what some referred to as "vegetable skyscrapers." To attract attention to the trees, the Becks named several of the biggest, honoring people such as pianist Jan Paderewski (Louise Beck taught piano), Theodore Roosevelt, and Robert E. Lee. Apparently the Becks also felt that a little hyperbole would help: they claimed that the Lee tree topped out at more than 400 feet. But it couldn't have reached quite so high—no Douglas fir that tall has ever been found. More believable is that one tree had a circumference of 44 feet, though the Becks measured it closer to the ground than modern tree-circumference fanatics would. But these great trees did not survive long into the 20th century.

In 1910, the city acquired the park through condemnation proceedings from the Becks for $144,920. Within a few years, the Parks Department had cut down the Roosevelt tree, noting that it was a "threat to public safety." Hugo Winkenwerder, dean of the University of Washington's College of Forestry, declared the trees healthy and not in need of any additional assistance from the Parks Department, but more cutting ensued despite assurances from Parks Superintendent J. W. Thompson. People cited car pollution, storms, and chimney smoke as justification for the removal of the trees. Seattle Parks Department historian Don Sherwood, however, noted that unjustified tree cutting regularly occurred in the parks. "Just label it 'diseased' and out it went," he said. All of the big trees were gone by the end of the 1920s, and no physical evidence of them, such as stumps, remains.`,
    },
    {
      id: 10,
      title: 'WPA Bridge · 1936',
      location: 'Boundary between Cowen & Ravenna Parks',
      coords: { lat: 47.6700, lng: -122.2960 },
      content: `A two-level wooden pedestrian bridge formerly crossed the Ravenna ravine at 15th Avenue NE. The bridge above you, which marks the boundary between Cowen and Ravenna Parks, was built as a Works Progress Administration project in 1936 and reflects the Art Deco aesthetic of the era. The apex of the graceful arch is 60 feet above the creek. Farther east is the 20th Avenue Bridge, built in 1913–14 for about $55,000. It was closed to motor vehicles in 1975 after engineers determined it needed costly upgrades for continued automobile traffic. Both bridges are city landmarks.

Ravenna Creek follows a route that is a bit anomalous in Seattle. The city's predominant topographic features are north–south trending ridges and troughs that developed during the last Ice Age. In contrast, Ravenna Creek and the nearby Lake Washington Ship Canal cut against the grain in northwest–southeast trending channels. Geologists propose that the waterways follow topographic lows that developed under the ice and were then enlarged by water at the base of the glacier. Why the channels trend the way they do is less clear. They could mirror either an unrecognized tectonic structure or a deeply buried structure in the bedrock, but there is no undisputed evidence for either structure. No matter what caused the ravine that Ravenna Creek follows through Ravenna Park, it formed one of the great geological curiosities of our local topography.

Although the upper part of Ravenna Creek is locked into a sewer pipe, numerous seeps, springs, and small tributaries provide enough water for the creek to flow year round in Cowen and Ravenna Parks.`,
    },
    {
      id: 11,
      title: 'Cowen Park Entrance',
      location: 'NE 61st St & University Way NE',
      coords: { lat: 47.6710, lng: -122.2984 },
      content: `Real estate developer Charles Cowen donated 12 acres of land to the city for this park in 1906. He is honored by a sign on the park's gates at University Way NE. Originally dominated by a ravine with a meandering Ravenna Creek, the park changed substantially in 1960 with the addition of 100,000 cubic yards of fill from the construction of I-5. Although many neighbors approved of eliminating the ravine, which they thought was the "biggest nest for juvenile delinquency in the city," others called the filling of the ravine "outrageous."`,
    },
    {
      id: 12,
      title: 'North Trunk Sewer Ridge',
      location: 'Ravenna Blvd at Brooklyn Ave NE',
      coords: { lat: 47.6715, lng: -122.3018 },
      content: `At this point, the subterranean, six-foot-diameter North Trunk Sewer pipe carrying Ravenna Creek continues southeast under the ridge that begins to rise to the east and descends to a connector near what is now University Village. Contractors initially attempted to dig the pipe's underground route through the 17th Avenue ridge with a boring machine, which worked on roughly the same principle as the much larger, modern descendants used for light rail and State Route 99 tunnels. However, this first-ever attempt at tunnel boring in Seattle failed because of mechanical problems. The contractor then came up with the novel solution of digging the tunnel by hand with picks and shovels and lining it with brick. Workers advanced through the ridge averaging about 50 feet per week.`,
    },
    {
      id: 13,
      title: 'Under I-5 · Columnseum',
      location: 'Ravenna Blvd under Interstate 5',
      coords: { lat: 47.6726, lng: -122.3090 },
      content: `Artist Sheila Klein completed her art piece Columnseum in 2007 by painting more than 250 columns in the 10-acre space under I-5. Klein's website notes that "rather than fight the massive existing infrastructure, the project works with the site's own visual vocabulary: parking paint and concrete columns. The lot was painted with simple shapes drawn from parking lot vernacular (white stripes/blue handicap) to minimize the dark space and accentuate the architecture."

Perhaps the most unusual structure associated with I-5 is a nuclear fallout shelter built under the freeway on Weedin Place (across from 68th Avenue NE), just north of the north end of the Ravenna Park and Ride. Designed to house 200 people for two weeks, the shelter had diesel-powered electricity generators, an air circulation system, a well, and piping connected to the city's water and sewer systems. Fortunately, no one needed to use the space for its intended purpose, and it ended up serving more prosaic functions as a storage facility and a driver's license bureau for the Washington Department of Transportation. (Only the front door is visible at the site.)

Plans for a freeway linking Seattle to Tacoma and Everett started in the early 1950s but did not gain full momentum until the passage of the National Interstate and Defense Highways Act of 1956. Early sections of what became Interstate 5 opened in 1962 with the complete route from Everett to Tacoma opening five years later.`,
    },
    {
      id: 14,
      title: 'Clock Tower & Lake Map',
      location: 'Triangular building at NE 70th St, Woodlawn Ave N & Ravenna Blvd',
      coords: { lat: 47.6748, lng: -122.3183 },
      content: `Artist Carolyn Law created this map of the lake in 2010. The green terrazzo marks the modern lake edge, and the line surrounding it indicates the historic shoreline. The largest of the buildings on the lake's edge is the community center, with the wedge-shaped Aqua Theater closest to Ravenna Boulevard and the sort of ear-shaped wading pool at the lake's north end.

Law hoped that as this neighborhood developed and people had to slow down for increased traffic, they would pay attention and notice the details of the lake.

Along Ravenna Boulevard, note the large caiman sculpture filled with plants on the lawn in front of the John Marshall School. The tall trees growing along the boulevard include English oaks, sycamore maples, and red maples, none of which are native. When the trees have no leaves, look for the many squirrel nests, which look like balls of clumped leaves.`,
    },
    {
      id: 15,
      title: 'Green Lake Shore',
      location: 'East shore, near Evans Pool & Community Center',
      coords: { lat: 47.6787, lng: -122.3309 },
      content: `For thousands of years, Green Lake and Lake Washington were connected by Ravenna Creek, which flowed southeast down what is now Ravenna Boulevard before veering slightly north and continuing through the densely forested ravine of what became Ravenna Park. The creek emerged from the ravine into a sphagnum bog that spread across the area now covered by University Village. Its journey ended in Lake Washington at Union Bay, which historically extended north to modern NE 45th Street, about one-half mile north of today's shoreline.

Ravenna Creek vanished from its upper reach when workers put the water into a pipe as part of the North Trunk Sewer system. Built because of concerns over typhoid and cholera in contaminated drinking water, the North Trunk consolidated outflow north of the soon-to-be-built Lake Washington Ship Canal via 22 miles of sewer pipes, the largest of which had a 12-foot diameter. The system extended from West Point on Magnolia to Green Lake, with the Ravenna pipe section completed in 1911.

Following the elimination of the creek, the city opened the 160-foot-wide Ravenna Boulevard, which included a bridle path, planting strip, and roadways. In 1961, the city replaced the original paths with grass.

The riparian corridor from Lake Washington to Ravenna was likely used by Native residents, in particular to access liq'təd (Whulshootseed for "red paint"), a sacred spring a mile north of Green Lake, which was known as dxʷƛ'əš (meaning unknown). Green Lake would have been a good source for fish, such as suckers, and plants, such as tule and salmonberry.

Green Lake originally covered what are now the park's ball fields and the community center and its parking lot. A General Land Office survey around the lake found a forest of Douglas fir (eight feet in diameter), western red cedar, western hemlock, red alder, and maples, both vine (closer to the creek) and bigleaf. Along the lakeshore were dense, brushy areas of salmonberry and willow.

The fertile land attracted settlers and developers, including Guy Phinney, who built a small mill at the lake that could cut 10,000 board feet a day. Although the land was far from the center of population in Seattle, a trolley connected Green Lake to downtown. The tracks initially ran along the east side of the lake and around to the north end but ultimately completed a loop around the lake and back down the west side.

Three years after Ravenna Creek disappeared into its pipe, the city, on the advice of park designer John Charles Olmsted (of the Olmsted Brothers landscape architecture firm), lowered the lake seven feet, which added 100 acres of new land to the park, primarily around the lake's outlet. By this time, most of the lake had been logged, streets had been platted, and numerous houses had been built.`,
    },
  ],
};
