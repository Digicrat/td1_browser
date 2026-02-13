function newUUID() {
  return crypto.randomUUID();
}
function spoolToHueforge(spool) {
    const td = parseFloat(spool.extra?.td ?? spool.filament.extra?.td);
    if (!td) return null;
    
    const filament = spool.filament || {};
    const vendor = filament.vendor || {};
    
    return {
	Brand: vendor.name || "Unknown",
	Color: "#" + (filament.color_hex || "000000"),
	Name: filament.name || "Unknown",
	Owned: !spool.archived,
	Tags: [],
	Transmissivity: td,
	Type: filament.material || "PLA",
	uuid: "{" + newUUID() + "}"
    };
}
function downloadJSON(obj, filename) {
  const blob = new Blob(
    [JSON.stringify(obj, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export async function exportToHueforge() {
  try {
    console.log("Fetching spools from Spoolman...");

    const res = await fetch("/spoolman/api/v1/spool");
    if (!res.ok) throw new Error("API request failed");

    const spools = await res.json();

    const filaments = [];

    for (const spool of spools) {
      const converted = spoolToHueforge(spool);
      if (converted) filaments.push(converted);
    }

    const output = {
      Filaments: filaments
    };

    downloadJSON(output, "hueforge_filaments.json");

    console.log(`Exported ${filaments.length} filaments to HueForge format`);

  } catch (err) {
    log("Export failed: " + err);
    console.error(err);
  }
}
