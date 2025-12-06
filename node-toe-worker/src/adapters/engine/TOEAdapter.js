const { exec } = require("child_process");
const path = require("path");
const EnginePort = require("../../ports/EnginePort");

class TOEAdapter extends EnginePort {
    generateFragments(inputIfcPath, outputDir) {
        return new Promise((resolve, reject) => {
            const cmd = `toe-cli extract "${inputIfcPath}" -o "${outputDir}"`;

            exec(cmd, (error, stdout, stderr) => {
                if (error) return reject(error);
                resolve({
                    frag: path.join(outputDir, "model.frag"),
                    geom: path.join(outputDir, "model.geom"),
                    ids: path.join(outputDir, "model.ids"),
                    meta: path.join(outputDir, "meta.json")
                });
            });
        });
    }
}

module.exports = TOEAdapter;
