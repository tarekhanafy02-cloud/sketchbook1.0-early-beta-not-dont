# testphysics

A browser driving game on a 5000 x 5000 m map, with a blocky character, 10 parkable cars and 4-corner spring/damper suspension. Single player and online multiplayer (Socket.IO).

## Run it on Replit
1. Create a new Repl (Node.js) and upload the contents of this folder (the `.replit` file must be at the top level), or import it from a zip.
2. Press **Run**. Replit runs `npm install` and `npm start` and opens the game in the preview window. Open it in a new tab to play.
3. Share the Repl's link so friends can join. To keep it online all the time, use **Deploy**.

## Admin panel
Players named `tarek` or `bucket_birb11` get an admin panel in multiplayer (button at the top right, or press the backtick key): announce, bring, go to, kick, reset all cars, and paint all cars. The server decides who is an admin.

Anyone can type those names while the real owner is offline, so open the **Secrets** tab in Replit and add `ADMIN_PASSWORD`. Once set, those names must enter the password to get the panel. You can also change the admin names with an `ADMINS` secret (comma separated).

## Controls
WASD move or drive, Shift run, Space jump or handbrake, E enter or leave a car or the plane (east of the lot), drag to look, scroll to zoom, Esc for the menu. Plane: hold W to take off, Up/Down arrows climb or dive, A/D turn.

## Stunt area and sports cars
North of the lot (about 130 m up the minimap) is a paved stunt area with kicker ramps and landing ramps, curved quarter-pipes, loops, a giant sphere and an elevated track. Four sports cars are parked at its entrance: faster, grippier and stiffer than the regular cars.

## Crash physics and more stuff
- Cars collide as rigid bodies: hits make them spin, bounce and dent where they were hit. Hard hits tear off the front or rear bumper, doors and even wheels (the car then limps on the missing wheel), with sparks, smoke and a thud. Press **R** in a car to repair it.
- Smashable cones, barrels and crates (a slalom, a barrel wall and a crate wall in and around the stunt area), solid buildings, concrete barriers and a solid giant sphere.
- Hills, yellow boost pads, and wind turbines on the horizon.
- Online, crashes and repairs are shared between players. Props and bits that have fallen off are not, so each player sees their own pile of debris.

## Engine bay
Cars are no longer hollow. The first time a car is damaged it gets a full engine bay (engine block, valve cover with spark plug boots, intake, radiator and spinning fan, battery, hoses, exhaust, frame rails, bumper beams) and an underbody (floor pan, fuel tank, exhaust, driveshaft). Hard front hits rip off the hood and bumpers so you can see the engine, which shakes and smokes. Flipped cars now rest on their roof or side.

## Sports car
The four sports cars (parked beside the spawn point) now have their own low wedge body with dark glass, a rear wing, a front splitter, headlights and taillights, and wider-set wheels. They dent, lose their hood and bumpers, and show an engine like the other cars. Every wheel now has a silver hubcap.
