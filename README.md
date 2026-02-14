The TD1 is an invaluable tool for reading values into Hueforge, but it is desirable to store all filament information in a single database and not have to enter details more than once.  This repository is my attempt to streamline the procss.

Instead of creating a custom API or app, this:
- Uses the browser to read TD1 from the connected TD1 directly
- Opens Spoolman as an iframe and fills out a custom TD field on demand within the nominal Spoolman UI for defining filaments or spools.


*UNTESTED* The "Generate Hueforge DB" button will download a JSON file that can be imported into HueForge as a new Filament DB/Set. This is a first-cut at such a feature and has not yet been tested in HueForge.  Spoolman's 'archived' flag is inverted to become HueForge's 'owned' flag.  Future updates may add additional filtering options.

# Usage

To read values from your TD1 without any other dependencies, simply visit the index.html page in any browser and press 'Connect' with your TD1 connected.  [Try it out here.](https://digicrat.github.io/td1_browser/)

To read values directly into Spoolman, visit spoolman.html (see Setup section for details/caveats). Navigate within Spoolman on the left to create a new Filament and/or Spool as desired.  After reading a filament, simply press the 'Copy values' button on the right to automatically populate the 'extra' field in Spoolman's existing UI. If adding multiple filaments in a row, you can check 'Auto' to copy it automatically on each reading.


# Setup
This is a static HTML/JS modification.  Simply host it appropriately.

## Spoolman

### Proxy Hosting
This assumes that spoolman is available at "./spoolman" by default.  If that is not the case, edit the iframe definition in spoolman.html.  Some features may not work correctly if hosted on a different server.

On my server:
- This repo is at /td1 of an Apache server
- A reverse proxy places spoolman at /spoolman

Apache configuration:
```
                ProxyPass "/spoolman" "http://localhost:7912/spoolman"
                ProxyPassReverse "/spoolman" "http://localhost:7912/spoolman"
```

To configure spoolman to be accessible at a subdomain when hosting via Docker, simply set the ENV variable SPOOLMAN_BASE_PATH=/spoolman.  

### Custom Fields

In Spoolman->Settings->Extra Fields define a new field named "TD" for both Spools and/or Filaments. The type should be set to "float"

Optionally define a second custom field for "color" to store the raw color code as measured by the TD1. 

TODO: Ideally this would also set the Color value in the 'Create Filament' page, but I haven't figured out how to updae that form value via this add-on yet. 


# Limitations

The Web Serial API should work on any modern browser under Linux, Mac, or Windows. Unfortunately, no Android browser currently appears to support the API.

Note: This is for reading the values from the TD1 only.  It's still beneficial to plug the TD1 into Hueforge periodically to ensure you have the latest firmware version. It is possible that future firmware updates could break this integration and require corresponding updates if they change the output formatting.


# License

This repository is provided under the MIT License.

NOTE: Portions of this repository was created with the aide of ChatGPT.


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
