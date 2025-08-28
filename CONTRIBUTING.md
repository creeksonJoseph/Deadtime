# Contributing to Deadtime 💀

Thank you for your interest in contributing to Deadtime! We welcome contributions from the community to help make this project better.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Deadtime.git
   cd Deadtime
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Cloudinary account
- GitHub OAuth App

### Installation
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client-side && npm install
```

### Environment Variables
Create `.env` files in both `server/` and `client-side/` directories following the examples in the README.

## 📝 How to Contribute

### 🐛 Bug Reports
- Use the GitHub issue tracker
- Include steps to reproduce
- Provide browser/OS information
- Add screenshots if applicable

### ✨ Feature Requests
- Check existing issues first
- Describe the feature clearly
- Explain why it would be useful
- Consider implementation complexity

### 🔧 Code Contributions

#### Before You Start
- Check existing issues and PRs
- Discuss major changes in an issue first
- Follow the existing code style
- Write tests for new features

#### Pull Request Process
1. **Update your fork** with the latest changes:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Make your changes** in a feature branch
3. **Test your changes** thoroughly
4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add project search functionality"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference related issues
   - Screenshots for UI changes
   - Test instructions

## 🎨 Code Style

### Frontend (React)
- Use functional components with hooks
- Follow existing Tailwind CSS patterns
- Use TypeScript-style prop validation
- Keep components small and focused

### Backend (Node.js)
- Use async/await over promises
- Follow RESTful API conventions
- Add proper error handling
- Include JSDoc comments for functions

### General
- Use meaningful variable names
- Keep functions small and pure
- Add comments for complex logic
- Follow existing file structure

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd client-side && npm test

# Backend tests  
cd server && npm test
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Test edge cases and error conditions
- Maintain good test coverage

## 📚 Documentation

- Update README.md for new features
- Add JSDoc comments to functions
- Update API documentation
- Include setup instructions for new dependencies

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help newcomers get started
- Provide constructive feedback
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

## 🎯 Priority Areas

We especially welcome contributions in:
- 🔍 Search and filtering improvements
- 📱 Mobile responsiveness
- ♿ Accessibility features
- 🧪 Test coverage
- 📚 Documentation
- 🐛 Bug fixes

## 📞 Getting Help

- Join our discussions in GitHub Issues
- Ask questions in pull requests
- Contact maintainers: [charanajoseph@gmail.com](mailto:charanajoseph@gmail.com)

## 🙏 Recognition

Contributors will be:
- Added to the README contributors section
- Mentioned in release notes
- Given credit in commit messages

---

**Happy coding! Let's bring dead projects back to life together** 💀✨