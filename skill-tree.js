const designRoadmap = document.getElementById("design");
const coordinationRoadmap = document.getElementById("coordination");
const frontendRoadmap = document.getElementById("frontend");

showRoadmap("./design-roadmap.json");

designRoadmap.addEventListener("click", function () {
	showRoadmap("./design-roadmap.json");
});

coordinationRoadmap.addEventListener("click", function () {
	showRoadmap("./coordination-roadmap.json");
});

frontendRoadmap.addEventListener("click", function () {
	showRoadmap("./frontend-roadmap.json");
});

function showRoadmap(data) {
	fetch(data)
		.then((response) => response.json())
		.then((data) => {
			// Normalizacion del JSON
			/* const skillFirstArr = [];
		 for (const entryObj of data[0].roadmap) {
      for (const skill of entryObj.skills) {
        let skillFirstObj = skillFirstArr.find((item) => item.name === skill);
        if (!skillFirstObj) {
          skillFirstObj = {
            skill,
            resources: [],
            requirements: entryObj.requirements,
          };
          skillFirstArr.push(skillFirstObj);
        }
        skillFirstObj.resources.push({
          title: entryObj.title,
          link: entryObj.link,
          tracking: entryObj.tracking,
          language: entryObj.language,
        });
      }
    } */
			/* const jsonNew = [];
			for (const obj of data) {
				if (!jsonNew.some((item) => item.skill === obj.skill)) {
					const newObj = {
						skill: obj.skill,
						requirements: obj.requirements,
						resources: obj.resources,
					};
					jsonNew.push(newObj);
				} else {
					const indexObj = jsonNew.findIndex((item) => item.skill == obj.skill);
					for (const resource of obj.resources) {
						jsonNew[indexObj].resources.push(resource);
					}
				}
			} */

			// segunda pasada
			for (const skillObj of data) {
				for (const requirement of skillObj.requirements) {
					const skillObjRequirement = data.find((item) => item.skill === requirement);
					if (skillObjRequirement) {
						if (!skillObjRequirement.children) {
							skillObjRequirement.children = [];
						}
						skillObj.delete = true;
						skillObjRequirement.children.push(skillObj);
						skillObjRequirement.connectors = { style: { stroke: "#fff" } };
					}
				}
				delete skillObj.requirements;
				skillObj.text = { name: skillObj.skill };
			}

			const newArray = data.filter((obj) => !obj.delete);
			console.log(newArray);
			const rootNode = {
				text: { name: "Manejo básico de una computadora y un browser" },
				children: newArray,
				connectors: {
					style: {
						stroke: "#fff",
					},
				},
			};

			const simple_chart_config = {
				chart: {
					container: "#skill-tree",
					rootOrientation: "WEST",
					connectors: {
						type: "step",
						style: {
							stroke: "#fff",
						},
					},
					nodeAlign: "BOTTOM",
					node: {
						link: { target: "_blank" },
						HTMLclass: "mainTree",
					},
				},

				nodeStructure: rootNode,
			};
			new Treant(simple_chart_config);
		})
		.catch((error) => {
			console.error("Error al obtener JSON:", error);
		});
}
