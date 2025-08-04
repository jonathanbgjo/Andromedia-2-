@DataJpaTest
class VideoRepositoryTest {

    @Autowired
    private VideoRepository videoRepository;

    @Test
    void saveVideo() {
        Video video = new Video();
        video.setTitle("Test Video");
        video.setDescription("Just a test");

        Video saved = videoRepository.save(video);
        assertNotNull(saved.getId());
    }
}
