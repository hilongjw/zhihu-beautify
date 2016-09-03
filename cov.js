;(function (global, Vue) {
var isLarge = /_l.(jpg|png)/
var peopleVue = function (data) {
	var app = new Vue({
		el: 'app',
		template: `
			<div class="cov_bg">
				<div class="cov-cover" :style="{'background-image': 'url(' + rawImgFormater(user.avatar) + ')'}"></div>
				<div class="cov-user">
					<div class="cov-user-avatar-box">
						<img class="cov-user-avatar" :src="user.avatar"/>
					</div>
					<div class="cov-user-name">
						<span>{{user.name}}</span>
						<a v-if="user.weibo" class="cov-user-weibo" target="_blank" :href="user.weibo" >
							<i class="zm-profile-header-icon sina"></i>
						</a>
					</div>
					<div class="cov-user-bio">
						<p>{{user.bio}}</p>
					</div>
					<div class="cov-user-describe">
						<div class="cov-user-item cov-location" v-if="user.location.title">
							<a target="_blank" :href="user.location.src">
								<i class="icon icon-profile-location"></i>
								<span>{{user.location.title}}</span>
							</a>
						</div>
						<div class="cov-user-item cov-employment" v-if="user.employment.title">
							<a target="_blank" :href="user.employment.src">
								<i class="icon icon-profile-company"></i>
								<span>{{user.employment.title}}</span>
							</a>
						</div>
						<div class="cov-user-item cov-education" v-if="user.education.title">
							<a target="_blank" :href="user.education.src">
								<i class="icon icon-profile-education"></i>
								<span>{{user.education.title}}</span>
							</a>
						</div>
					</div>
					<div class="cov-content">
						<a :href="currentHref('followees')">
							<div class="cov-user-content-item">
								{{user.following}} 关注
							</div>
						</a>
						<a :href="currentHref('followers')">
							<div class="cov-user-content-item">
								{{user.follower}} 粉丝
							</div>
						</a>
						<a :href="currentHref('answers')">
							<div class="cov-user-content-item">
								{{user.answerCount}} 回答
							</div>
						</a>
					</div>
				</div>
			</div>
		`,
		data: function () {
			return {
				user: data
			}
		},
		methods: {
			rawImgFormater (src) {
				if (isLarge.test(src)) {
					return src.replace('_l.jpg', '.jpg').replace('_l.png', '.png')
				}
				return src
			},
			currentHref (gopath) {
				var url = global.location.href //'https://www.zhihu.com/people/aweeeeeeee/followees'
				var reg = /https:\/\/www.zhihu.com\/people\/(\w*)($|\/\S*)/
				var user = url.match(reg)[1]

				if (user) {
					return `https://www.zhihu.com/people/${user}/${gopath}`
				} else {
					return `https://www.zhihu.com/`
				}
				
			}
		}
	})
}

global.peopleVue = peopleVue

})(this, this.Vue);

(function (global) {
	var peopleRunner = function () {
		var container = document.createElement('div')
		var globalMsg = document.getElementById('zh-global-message')

		container.classList.add('cov-container')
		container.innerHTML = '<app></app>'
		var covContainer = document.body.insertBefore(container, globalMsg)

		var oldHeader = document.getElementsByClassName('zm-profile-header')[0]

		var getHeaderInfo = function (className, type) {
			var node = oldHeader.getElementsByClassName(className)[0]
			
			if (node) {
				return node[type]
			}
			return ''
		}

		var getHeaderTagInfo = function (parentClass, tagName, type, count) {
			if (!count) count = 0
			var parentNode = document.body.getElementsByClassName(parentClass)[0]
			var infoNode
			if (parentNode && parentNode.getElementsByTagName(tagName[count])) {
				infoNode = parentNode.getElementsByTagName(tagName)[count]
				return infoNode[type]
			}
			return ''
		}

		var getInfoByCount = function (parentClass, className, tagName, type, count) {
			var parentNode = document.body.getElementsByClassName(parentClass)[0]
			var infoNode
			if (parentNode && parentNode.getElementsByClassName(className)[count]) {
				infoNode = parentNode.getElementsByClassName(className)[count].getElementsByTagName(tagName)[0]
				return infoNode[type]
			}
			return ''
		}

		var getUserGender = function () {
			if (oldHeader.getElementsByClassName('icon-profile-male')[0]) {
				return 'male'
			}
			if (oldHeader.getElementsByClassName('icon-profile-female')[0]) {
				return 'female'
			}
			return ''
		}

		var getInfo = (parentClass, className, type, count) => {
			if (!count) count = 0
			var parentNode = document.body.getElementsByClassName(parentClass)[0]
			var infoNode
			if (parentNode && parentNode.getElementsByClassName(className)[count]) {
				infoNode = parentNode.getElementsByClassName(className)[count]
				return infoNode[type]
			}
			return ''
		}

		var info = {
			name: getHeaderInfo('name', 'innerText'),
			bio: getHeaderInfo('bio', 'innerText'),
			weibo: getHeaderInfo('zm-profile-header-user-weibo', 'href'),
			avatar: getHeaderInfo('Avatar', 'src'),
			gender: getUserGender(),
			fold: getHeaderInfo('fold-item', 'innerText'),
			userAgree: getHeaderTagInfo('zm-profile-header-user-agree', 'strong', 'innerText'),
			userThanks: getHeaderTagInfo('zm-profile-header-user-thanks', 'strong', 'innerText'),
			following: getInfoByCount('zm-profile-side-following', 'item', 'strong', 'innerText', 0),
			follower: getInfoByCount('zm-profile-side-following', 'item', 'strong', 'innerText', 1),
			questionCount: getInfoByCount('profile-navbar', 'item', 'span', 'innerText', 1),
			answerCount: getInfoByCount('profile-navbar', 'item', 'span', 'innerText', 2),
			postCount: getInfoByCount('profile-navbar', 'item', 'span', 'innerText', 3),
			collectionCount: getInfoByCount('profile-navbar', 'item', 'span', 'innerText', 4),
			editCount: getInfoByCount('profile-navbar', 'item', 'span', 'innerText', 5),
			location: {
				title: getHeaderInfo('location', 'innerText'),
				src: getInfo('location', 'topic-link', 'href')
			},
			business: {
				title: getHeaderInfo('business', 'innerText'),
				src: getInfo('business', 'topic-link', 'href')
			},
			employment: {
				title: getHeaderInfo('employment', 'innerText'),
				src: getInfo('employment', 'topic-link', 'href')
			},
			position: {
				title: getHeaderInfo('position', 'innerText'),
				src: getInfo('position', 'topic-link', 'href')
			},
			education: {
				title: getHeaderInfo('education', 'innerText'),
				src: getInfo('education', 'topic-link', 'href')
			},
			educationExtra: {
				title: getHeaderInfo('education-extra', 'innerText'),
				src: getInfo('education-extra', 'topic-link', 'href')
			}
		}
		global.peopleVue(info)
	}

	var covInit = function () {
		var url = global.location.href //'https://www.zhihu.com/people/aweeeeeeee/followees'
		var reg = /https:\/\/www.zhihu.com\/people/
		if (reg.test(url)) {
			peopleRunner()
		}
	}

	covInit()
})(this);
