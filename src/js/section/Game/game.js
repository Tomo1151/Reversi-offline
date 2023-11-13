class Game extends Section {

	constructor(game_manager, renderer_manager, scene) {
		super(game_manager, renderer_manager, scene);
	}

	run() {}

	init() {
		const l = new THREE.AmbientLight(0xffffff, 1);
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.intensity = 1;
		light.position.set(0, 0, 40);
		// scene.add(new THREE.AxesHelper(500));
		this.scene.add(l)
		this.scene.add(light);

		let hitboxes = [];

		const loader = new THREE.GLTFLoader();
		const model_load = async (fbx_path, on_load_func) => {
			return new Promise(res => {
				loader.load(fbx_path, (obj) => {
					on_load_func(obj);
					res();
				});
			})
		}

		model_load('model_data/Board_low.gltf', (obj) => {
			obj.scene.scale.set(5, 5, 5);
			obj.scene.position.set(0, 0.5, 0);
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					const g = new THREE.BoxGeometry(9.99, 1.15, 9.99);
					const m = new THREE.MeshStandardMaterial({
						color:0x000000,
						opacity: 0.5,
						transparent: true
					});
					const box = new THREE.Mesh(g, m);
					box.position.set(10*j - (10*3+5), 0, 10*i - (10*3+5));
					box.cell_x = j;
					box.cell_y = i;
					hitboxes.push(box);
					this.scene.add(box);
				}
			}
			this.scene.add(obj.scene);
		});

		let disk_meshes = []

		model_load('model_data/Disk_low.gltf', (obj) => {
			let disk;
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					disk = obj.scene.clone();
					disk.scale.set(4, 4, 4);
					disk.position.set(10*j - (10*3+5), 1, 10*i - (10*3+5));
					disk.visible = false;
					disk_meshes.push(disk);
					this.scene.add(disk);
				}
			}
		});


		let intersects = [];
		let selected_box;

	}
}