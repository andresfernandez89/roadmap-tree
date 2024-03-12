const designRoadmap = document.getElementById("design");
const coordinationRoadmap = document.getElementById("coordination");
const frontendRoadmap = document.getElementById("frontend");

designRoadmap.addEventListener("click", function () {
	showRoadmap("./design-roadmap.json");
});

coordinationRoadmap.addEventListener("click", function () {
	showRoadmap("./coordination-roadmap.json");
});

frontendRoadmap.addEventListener("click", function () {
	showRoadmap("./frontend-roadmap.json");
});

function showRoadmap(json) {
	fetch(json)
		.then((response) => response.json())
		.then((data) => {
			//const skillFirstArr = [];

			// primera pasada
			/* for (const entryObj of data[0].roadmap) {
				for (const skill of entryObj.skills) {
					let skillFirstObj = skillFirstArr.find((item) => item.name === skill);
					if (!skillFirstObj) {
						skillFirstObj = {
							text: { name: skill }, // cree la propiedad text.name
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
			}
	 */
			//console.log(JSON.stringify(skillFirstArr, null, 2)); // guardar el output de esto y ponerlo como design-romap.json, es el que va a ser modificado manualmente en el github

			// segunda pasada
			for (const skillObj of data) {
				for (const requirement of skillObj.requirements) {
					const requirementObj = data.find((item) => item.text.name === requirement);
					if (requirementObj) {
						if (!requirementObj.children) {
							requirementObj.children = [];
						}
						requirementObj.children.push(skillObj);
					}
				}
				//skillObj.text = { name: skillObj.name }; // sacar porque sino queda la info repetida, habría que crear directamente este skillObj.text en la primera pasada
				delete skillObj.requirements;
			}

			const rootNode = {
				text: { name: "Manejo básico de una computadora y un browser" },
				children: data,
			}; // habría que ver como hacer un tree con nodos huérfanos, sin tener un root principal

			const simple_chart_config = {
				chart: {
					container: "#skill-tree",
					rootOrientation: "WEST",
					connectors: {
						type: "step",
					},
					nodeAlign: "BOTTOM",
					node: {
						link: { target: "_blank" },
					},
					node: {
						HTMLclass: "mainTree",
					},
				},

				nodeStructure: rootNode,
			};
			const my_chart = new Treant(simple_chart_config);
		})
		.catch((error) => {
			console.error("Error al obtener JSON:", error);
		});
}
