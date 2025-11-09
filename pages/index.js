import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { useEffect, useState } from 'react';
import Link from 'next/link'

const ipfsGateway = (process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/').replace(/\/?$/, '/');

export default function Index({AllData, HealthData, EducationData,AnimalData}) {
  const [filter, setFilter] = useState(AllData);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setFilter(AllData);
    setActiveCategory('All');
  }, [AllData]);

  const handleFilter = (category, data) => {
    setFilter(data);
    setActiveCategory(category);
  };

  return (
    <HomeWrapper>
      <HeroSection>
        <HeroContent>
          <HeroBadge>TrustFund Campaigns</HeroBadge>
          <HeroHeading>Invest in the stories that shape tomorrow.</HeroHeading>
          <HeroSubheading>
            Discover vetted initiatives across health, education, and animal welfare. Join a
            community committed to transparent, impactful giving.
          </HeroSubheading>
        </HeroContent>
        <HeroCard>
          <HeroMetric>
            <MetricNumber>{AllData?.length || 0}</MetricNumber>
            <MetricLabel>Active campaigns</MetricLabel>
          </HeroMetric>
          <MetricDivider />
          <HeroMetric>
            <MetricNumber>{(HealthData?.length ?? 0) + (EducationData?.length ?? 0)}</MetricNumber>
            <MetricLabel>Thematic funds</MetricLabel>
          </HeroMetric>
        </HeroCard>
      </HeroSection>

      {/* Filter Section */}
      <FilterWrapper>
        <FilterLabel>
          <FilterIconWrapper>
            <FilterAltIcon />
          </FilterIconWrapper>
          Browse categories
        </FilterLabel>
        <FilterChips>
          <Category type="button" onClick={() => handleFilter('All', AllData)} active={activeCategory === 'All'} aria-pressed={activeCategory === 'All'}>All</Category>
          <Category type="button" onClick={() => handleFilter('Health', HealthData)} active={activeCategory === 'Health'} aria-pressed={activeCategory === 'Health'}>Health</Category>
          <Category type="button" onClick={() => handleFilter('Education', EducationData)} active={activeCategory === 'Education'} aria-pressed={activeCategory === 'Education'}>Education</Category>
          <Category type="button" onClick={() => handleFilter('Animal', AnimalData)} active={activeCategory === 'Animal'} aria-pressed={activeCategory === 'Animal'}>Animal</Category>
        </FilterChips>
      </FilterWrapper>

      {/* Cards Container */}
      <CardsWrapper>

      {/* Card */}
      {filter.map((e) => {
        return (
          <Card key={e.title}>
          <CardImg>
            <Image 
              alt={`${e.title} campaign visual`}
              layout='fill' 
              src={`${ipfsGateway}${e.image}`} 
            />
          </CardImg>
          <CardBody>
            <Title>
              {e.title}
            </Title>
            <CardMeta>
              <MetaItem>
                <MetaIcon>
                  <AccountBoxIcon />
                </MetaIcon>
                <MetaLabel>Owner</MetaLabel>
                <MetaValue>{e.owner.slice(0,6)}...{e.owner.slice(39)}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaIcon>
                  <PaidIcon />
                </MetaIcon>
                <MetaLabel>Required</MetaLabel>
                <MetaValue>{e.amount} Matic</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaIcon>
                  <EventIcon />
                </MetaIcon>
                <MetaLabel>Created</MetaLabel>
                <MetaValue>{new Date(e.timeStamp * 1000).toLocaleString()}</MetaValue>
              </MetaItem>
            </CardMeta>
          </CardBody>
          <Link passHref href={'/' + e.address}><Button>
            View campaign
          </Button></Link>
        </Card>
        )
      })}
        {/* Card */}

      </CardsWrapper>
    </HomeWrapper>
  )
}



export async function getStaticProps() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    CampaignFactory.abi,
    provider
  );

  const getAllCampaigns = contract.filters.campaignCreated();
  const AllCampaigns = await contract.queryFilter(getAllCampaigns);
  const AllData = AllCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  const getHealthCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Health');
  const HealthCampaigns = await contract.queryFilter(getHealthCampaigns);
  const HealthData = HealthCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  const getEducationCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'education');
  const EducationCampaigns = await contract.queryFilter(getEducationCampaigns);
  const EducationData = EducationCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  const getAnimalCampaigns = contract.filters.campaignCreated(null,null,null,null,null,null,'Animal');
  const AnimalCampaigns = await contract.queryFilter(getAnimalCampaigns);
  const AnimalData = AnimalCampaigns.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.campaignAddress
    }
  });

  return {
    props: {
      AllData,
      HealthData,
      EducationData,
      AnimalData
    },
    revalidate: 10
  }
}






const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 32px 24px 64px;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`

const HeroSection = styled.section`
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const HeroBadge = styled.span`
  align-self: flex-start;
  padding: 8px 14px;
  background: ${(props) => props.theme.badgeBg};
  color: ${(props) => props.theme.badgeColor};
  border-radius: 999px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
`

const HeroHeading = styled.h1`
  font-size: clamp(34px, 4vw, 46px);
  font-family: 'Playfair Display', serif;
  color: ${(props) => props.theme.color};
  max-width: 520px;
`

const HeroSubheading = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${(props) => props.theme.textSecondary};
  max-width: 560px;
`

const HeroCard = styled.div`
  background: ${(props) => props.theme.glassBg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  border-radius: 20px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${(props) => props.theme.cardShadow};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 24px;
  }
`

const HeroMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`

const MetricDivider = styled.div`
  width: 1px;
  height: 48px;
  background: ${(props) => props.theme.borderColor};

  @media (max-width: 480px) {
    width: 80%;
    height: 1px;
  }
`

const MetricNumber = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
`

const MetricLabel = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const FilterWrapper = styled.div`
  width: min(1120px, 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.glassBg};
  border: 1px solid ${(props) => props.theme.glassBorder};
  padding: 18px 24px;
  border-radius: 16px;
  box-shadow: ${(props) => props.theme.cardShadow};
  gap: 16px;
  flex-wrap: wrap;
`

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 15px;
  color: ${(props) => props.theme.color};
`

const FilterIconWrapper = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${(props) => props.theme.primaryColor}15;
  color: ${(props) => props.theme.primaryColor};
`

const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

const Category = styled.button`
  border: 1px solid ${(props) => props.active ? props.theme.primaryColor : props.theme.borderColor};
  background: ${(props) => props.active ? props.theme.primaryColor : props.theme.bgDiv};
  color: ${(props) => props.active ? '#fff' : props.theme.color};
  padding: 10px 18px;
  border-radius: 999px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.primaryColor};
    color: #fff;
    border-color: ${(props) => props.theme.primaryColor};
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`

const CardsWrapper = styled.div`
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
  margin-top: 8px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgDiv};
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.borderColor};
  box-shadow: ${(props) => props.theme.cardShadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`

const CardImg = styled.div`
  position: relative;
  height: 180px;
  width: 100%;
`

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 22px;
`

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: ${(props) => props.theme.color};
  margin: 0;
`

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const MetaItem = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: ${(props) => props.theme.bgSubDiv};
  border: 1px solid ${(props) => props.theme.borderColor};
`

const MetaIcon = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${(props) => props.theme.primaryColor}12;
  color: ${(props) => props.theme.primaryColor};
`

const MetaLabel = styled.span`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(props) => props.theme.textSecondary};
`

const MetaValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.color};
  justify-self: flex-start;
`

const Button = styled.button`
  padding: 14px 18px;
  text-align: center;
  width: calc(100% - 44px);
  margin: 0 auto 22px;
  background: linear-gradient(120deg, ${(props) => props.theme.primaryColor}, ${(props) => props.theme.accentColor});
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  letter-spacing: 0.12em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.cardHoverShadow};
  }
`