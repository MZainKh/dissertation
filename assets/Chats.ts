export default {
	id: '1',
	users: [{
		id: 'u1',
		name: 'Zain',
		imageUri: 'https://media-exp1.licdn.com/dms/image/C4D03AQFTPuDq7goAWA/profile-displayphoto-shrink_200_200/0/1624307361427?e=1654732800&v=beta&t=XibugeXdyfrSaUgw7df0RvS_KRghIsxpL-iz9TPy4pw',
	}, {
		id: 'u2',
		name: 'Gojo Satoru',
		imageUri: 'https://cdn131.picsart.com/343023738014201.jpg?to=crop&type=webp&r=1000x1000&q=95',
	}],
	messages: [{
		id: 'm1',
		content: 'How are you, Gojo!',
		createdAt: '2022-04-10T12:48:00.000Z',
		user: {
			id: 'u1',
			name: 'Zain',
		},
	}, {
		id: 'm2',
		content: 'I am fine, fine',
		createdAt: '2022-04-10T14:49:00.000Z',
		user: {
			id: 'u2',
			name: 'Gojo Satoru',
		},
	}, {
		id: 'm3',
		content: 'What about you?',
		createdAt: '2022-04-10T14:49:40.000Z',
		user: {
			id: 'u2',
			name: 'Gojo Satoru',
		},
	}, {
		id: 'm4',
		content: 'I am good too, completing the dissertation now.',
		createdAt: '2022-04-10T14:50:00.000Z',
		user: {
			id: 'u1',
			name: 'Zain',
		},
	}, {
		id: 'm5',
		content: 'How is Jujutsu Kaisen Anime?',
		createdAt: '2022-04-10T14:51:00.000Z',
		user: {
			id: 'u1',
			name: 'Zain',
		},
	}, {
		id: 'm6',
		content: 'it is popping off!',
		createdAt: '2022-04-10T14:49:00.000Z',
		user: {
			id: 'u2',
			name: 'Gojo Satoru',
		},
	}, {
		id: 'm7',
		content: 'oh btw, the JJK 0 movie is releasing soon online!',
		createdAt: '2022-04-10T14:53:00.000Z',
		user: {
			id: 'u2',
			name: 'Gojo Satoru',
		},
	}]
}

