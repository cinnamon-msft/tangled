import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { projectsApi } from '../api';
import { CraftType, ProjectStatus, Project } from '../types';

// Mock the API
vi.mock('../api', () => ({
  projectsApi: {
    getAll: vi.fn(),
  },
}));

const mockProjectsApi = vi.mocked(projectsApi);

// Helper to create test projects
const createProject = (overrides: Partial<Project> = {}): Project => ({
  id: 1,
  name: 'Test Project',
  craftType: CraftType.Knitting,
  status: ProjectStatus.InProgress,
  isFavorite: false,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  ...overrides,
});

// Helper to render with providers
const renderHomePage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the welcome message', async () => {
    mockProjectsApi.getAll.mockResolvedValue([]);

    renderHomePage();

    expect(screen.getByText('Welcome to Tangled')).toBeInTheDocument();
    expect(
      screen.getByText('Your personal crafts project tracker for knitting, crochet, and embroidery')
    ).toBeInTheDocument();
  });

  it('displays works in progress section when there are in-progress projects', async () => {
    const inProgressProject = createProject({
      id: 1,
      name: 'My Knitting Project',
      status: ProjectStatus.InProgress,
      craftType: CraftType.Knitting,
      startDate: '2025-01-01T00:00:00Z',
    });

    mockProjectsApi.getAll.mockResolvedValue([inProgressProject]);

    renderHomePage();

    expect(await screen.findByText('🚧')).toBeInTheDocument();
    expect(screen.getByText('Works in Progress')).toBeInTheDocument();
    expect(screen.getByText('My Knitting Project')).toBeInTheDocument();
  });

  it('does not display works in progress section when there are no in-progress projects', async () => {
    const completedProject = createProject({
      status: ProjectStatus.Completed,
    });

    mockProjectsApi.getAll.mockResolvedValue([completedProject]);

    renderHomePage();

    // Wait for the completed project to appear
    await screen.findByText('Test Project');

    expect(screen.queryByText('Works in Progress')).not.toBeInTheDocument();
  });

  it('displays completed knitting projects in their own section', async () => {
    const knittingProject = createProject({
      id: 1,
      name: 'Completed Scarf',
      status: ProjectStatus.Completed,
      craftType: CraftType.Knitting,
      completionDate: '2025-06-15T00:00:00Z',
    });

    mockProjectsApi.getAll.mockResolvedValue([knittingProject]);

    renderHomePage();

    expect(await screen.findByText('Knitting Projects')).toBeInTheDocument();
    expect(screen.getByText('Completed Scarf')).toBeInTheDocument();
  });

  it('displays completed crochet projects in their own section', async () => {
    const crochetProject = createProject({
      id: 2,
      name: 'Crochet Blanket',
      status: ProjectStatus.Completed,
      craftType: CraftType.Crochet,
      completionDate: '2025-05-01T00:00:00Z',
    });

    mockProjectsApi.getAll.mockResolvedValue([crochetProject]);

    renderHomePage();

    expect(await screen.findByText('Crochet Projects')).toBeInTheDocument();
    expect(screen.getByText('Crochet Blanket')).toBeInTheDocument();
  });

  it('displays completed embroidery projects in their own section', async () => {
    const embroideryProject = createProject({
      id: 3,
      name: 'Embroidered Pillow',
      status: ProjectStatus.Completed,
      craftType: CraftType.Embroidery,
      completionDate: '2025-04-01T00:00:00Z',
    });

    mockProjectsApi.getAll.mockResolvedValue([embroideryProject]);

    renderHomePage();

    expect(await screen.findByText('Embroidery Projects')).toBeInTheDocument();
    expect(screen.getByText('Embroidered Pillow')).toBeInTheDocument();
  });

  it('displays favorite star for favorite projects', async () => {
    const favoriteProject = createProject({
      id: 1,
      name: 'Favorite Project',
      status: ProjectStatus.InProgress,
      isFavorite: true,
    });

    mockProjectsApi.getAll.mockResolvedValue([favoriteProject]);

    renderHomePage();

    await screen.findByText('Favorite Project');
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('displays start date for in-progress projects', async () => {
    const projectWithStartDate = createProject({
      id: 1,
      name: 'Started Project',
      status: ProjectStatus.InProgress,
      startDate: '2025-01-15T00:00:00Z',
    });

    mockProjectsApi.getAll.mockResolvedValue([projectWithStartDate]);

    renderHomePage();

    await screen.findByText('Started Project');
    expect(screen.getByText(/Started:/)).toBeInTheDocument();
  });

  it('displays completion date for completed projects', async () => {
    const completedProject = createProject({
      id: 1,
      name: 'Finished Project',
      status: ProjectStatus.Completed,
      craftType: CraftType.Knitting,
      completionDate: '2025-06-01T00:00:00Z',
    });

    mockProjectsApi.getAll.mockResolvedValue([completedProject]);

    renderHomePage();

    await screen.findByText('Finished Project');
    expect(screen.getByText(/Completed:/)).toBeInTheDocument();
  });

  it('renders project cards as links to the projects page', async () => {
    const project = createProject({
      id: 1,
      name: 'Linked Project',
      status: ProjectStatus.InProgress,
    });

    mockProjectsApi.getAll.mockResolvedValue([project]);

    renderHomePage();

    const link = await screen.findByRole('link', { name: /Linked Project/i });
    expect(link).toHaveAttribute('href', '/projects');
  });

  it('displays multiple project categories when there are various completed projects', async () => {
    const projects = [
      createProject({
        id: 1,
        name: 'Knitting Item',
        status: ProjectStatus.Completed,
        craftType: CraftType.Knitting,
      }),
      createProject({
        id: 2,
        name: 'Crochet Item',
        status: ProjectStatus.Completed,
        craftType: CraftType.Crochet,
      }),
      createProject({
        id: 3,
        name: 'WIP Item',
        status: ProjectStatus.InProgress,
        craftType: CraftType.Embroidery,
      }),
    ];

    mockProjectsApi.getAll.mockResolvedValue(projects);

    renderHomePage();

    expect(await screen.findByText('Works in Progress')).toBeInTheDocument();
    expect(screen.getByText('Knitting Projects')).toBeInTheDocument();
    expect(screen.getByText('Crochet Projects')).toBeInTheDocument();
    expect(screen.queryByText('Embroidery Projects')).not.toBeInTheDocument(); // No completed embroidery
  });

  it('does not show completed sections when no projects are completed', async () => {
    const inProgressOnly = [
      createProject({
        id: 1,
        name: 'WIP 1',
        status: ProjectStatus.InProgress,
      }),
      createProject({
        id: 2,
        name: 'WIP 2',
        status: ProjectStatus.Planning,
      }),
    ];

    mockProjectsApi.getAll.mockResolvedValue(inProgressOnly);

    renderHomePage();

    await screen.findByText('WIP 1');

    expect(screen.queryByText('Knitting Projects')).not.toBeInTheDocument();
    expect(screen.queryByText('Crochet Projects')).not.toBeInTheDocument();
    expect(screen.queryByText('Embroidery Projects')).not.toBeInTheDocument();
  });
});