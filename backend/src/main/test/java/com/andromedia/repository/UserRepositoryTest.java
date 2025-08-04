@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void createAndFetchUser() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("testpass");
        user.setCreatedDate(LocalDateTime.now());

        User saved = userRepository.save(user);

        Optional<User> found = userRepository.findById(saved.getId());

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }
}
